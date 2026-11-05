"""
Buscador de trámites de Uruguay (gub.uy)
Uso CLI:
    python buscar.py "residencia"
    python buscar.py "cedula" --en-linea
    python buscar.py --organismo "Dirección Nacional de Migración"
    python buscar.py "partida" --detalle
"""

import os
import sys
import json
import sqlite3
import argparse

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tramites.db")

def buscar_tramites(query="", organismo="", en_linea=None, tiene_costo=None, limit=10):
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Base de datos no encontrada en {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    conditions = []
    params = []

    if query:
        # FTS5 search
        clean_q = query.replace('"', '""').strip()
        fts_query = " ".join([f'"{token}"*' for token in clean_q.split() if token])
        join_fts = "JOIN tramites_fts ON tramites.row_id = tramites_fts.row_id"
        conditions.append("tramites_fts MATCH ?")
        params.append(fts_query)
    else:
        join_fts = ""

    if organismo:
        conditions.append("(tramites.organismo LIKE ? OR tramites.organismo_padre LIKE ?)")
        params.extend([f"%{organismo}%", f"%{organismo}%"])

    if en_linea is not None:
        conditions.append("tramites.en_linea = ?")
        params.append(1 if en_linea else 0)

    if tiene_costo is not None:
        conditions.append("tramites.tiene_costo = ?")
        params.append(1 if tiene_costo else 0)

    if query:
        order_by = "ORDER BY bm25(tramites_fts)"
    else:
        order_by = "ORDER BY tramites.titulo ASC"

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    sql = f"""
    SELECT tramites.row_id, tramites.id, tramites.titulo, tramites.url, tramites.organismo,
           tramites.organismo_padre, tramites.descripcion, tramites.tags, tramites.en_linea,
           tramites.tiene_costo, tramites.costo_valor, tramites.costo_unidad, tramites.url_inicio,
           tramites.raw_json
    FROM tramites
    {join_fts}
    {where_clause}
    {order_by}
    LIMIT ?
    """
    params.append(limit)

    cur.execute(sql, params)
    rows = cur.fetchall()
    conn.close()

    resultados = []
    for r in rows:
        resultados.append({
            "row_id": r[0],
            "id": r[1],
            "titulo": r[2],
            "url": r[3],
            "organismo": r[4],
            "organismo_padre": r[5],
            "descripcion": r[6],
            "tags": r[7].split(", ") if r[7] else [],
            "en_linea": bool(r[8]),
            "tiene_costo": bool(r[9]),
            "costo": f"{r[10]} {r[11]}" if r[10] else ("Con costo" if r[9] else "Gratuito"),
            "url_inicio": r[12],
            "raw": json.loads(r[13]) if r[13] else {}
        })
    return resultados

def print_tramite(t, detalle=False):
    print("=" * 70)
    print(f"📋 {t['titulo']}")
    print(f"🏛️  Organismo: {t['organismo']} ({t['organismo_padre']})")
    print(f"🌐 Enlace ficha: {t['url']}")
    print(f"💻 En línea: {'Sí' if t['en_linea'] else 'No'}")
    if t.get('url_inicio'):
        print(f"🔗 Enlace inicio: {t['url_inicio']}")
    print(f"💰 Costo: {t['costo']}")
    if t.get('tags'):
        print(f"🏷️  Etiquetas: {', '.join(t['tags'])}")
    print(f"\n📖 Descripción:\n{t['descripcion'][:300]}...")
    
    if detalle and t.get('raw'):
        raw = t['raw']
        if raw.get('requisitos_generales'):
            print(f"\n📌 Requisitos generales:\n{raw['requisitos_generales'][:400]}...")
        if raw.get('en_linea', {}).get('como_se_hace'):
            print(f"\n🖥️  Cómo se hace en línea:\n{raw['en_linea']['como_se_hace'][:300]}...")
        if raw.get('presencial', {}).get('como_se_hace'):
            print(f"\n🏢 Cómo se hace presencial:\n{raw['presencial']['como_se_hace'][:300]}...")
        if raw.get('email_consulta'):
            print(f"\n✉️  Email consulta: {raw['email_consulta']}")

def main():
    parser = argparse.ArgumentParser(description="Buscador inteligente de trámites gub.uy")
    parser.add_argument("query", nargs="?", default="", help="Palabras clave a buscar (ej: residencia, pasaporte, bps)")
    parser.add_argument("--organismo", default="", help="Filtrar por organismo o ministerio")
    parser.add_argument("--en-linea", action="store_true", help="Filtrar solo trámites que se puedan iniciar en línea")
    parser.add_argument("--gratis", action="store_true", help="Filtrar solo trámites gratuitos")
    parser.add_argument("--limit", type=int, default=5, help="Límite de resultados (default: 5)")
    parser.add_argument("--detalle", action="store_true", help="Mostrar requisitos y detalles completos")

    args = parser.parse_args()

    tiene_costo = False if args.gratis else None
    en_linea = True if args.en_linea else None

    print(f"🔎 Buscando: '{args.query}' (en línea: {args.en_linea}, límite: {args.limit}) ...\n")
    resultados = buscar_tramites(
        query=args.query,
        organismo=args.organismo,
        en_linea=en_linea,
        tiene_costo=tiene_costo,
        limit=args.limit
    )

    if not resultados:
        print("❌ No se encontraron trámites con esos criterios.")
        return

    print(f"✅ Se encontraron {len(resultados)} trámites:\n")
    for r in resultados:
        print_tramite(r, detalle=args.detalle)
        print()

if __name__ == "__main__":
    main()
