import os
import sys
import json
import csv
import io
import re
import sqlite3
import urllib.request

# Ensure UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

CSV_URL = "https://catalogodatos.gub.uy/dataset/4249fa91-4e43-4428-be26-3e8c1400ed30/resource/41b02575-5cd6-461c-ab45-a54e93d751be/download/tramites.csv"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "tramites_data")

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'\r\n|\r', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def clean_tags(cat_text):
    if not cat_text:
        return []
    tags = [t.strip() for t in re.split(r'[|,;]', cat_text) if t.strip()]
    return list(dict.fromkeys(tags))

def parse_cost(row):
    tiene_costo = row.get("tiene_costo", "").strip() in ("1", "true", "True", "SI", "Si", "si")
    valor = row.get("valor", "").strip()
    unidad = row.get("unidad", "").strip()
    otros_costos = clean_text(row.get("otros_costos", ""))
    return {
        "tiene_costo": tiene_costo,
        "valor": valor if valor else None,
        "unidad": unidad if unidad else None,
        "otros_costos": otros_costos if otros_costos else None
    }

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    raw_csv_path = os.path.join(OUTPUT_DIR, "tramites_oficial_raw.csv")
    full_json_path = os.path.join(OUTPUT_DIR, "tramites_completo.json")
    summary_json_path = os.path.join(OUTPUT_DIR, "tramites_resumen.json")
    db_path = os.path.join(OUTPUT_DIR, "tramites.db")

    print(f"Descargando dataset oficial desde:\n{CSV_URL} ...")
    req = urllib.request.Request(CSV_URL, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    with urllib.request.urlopen(req) as resp:
        content_bytes = resp.read()

    print(f"Descargado con éxito: {len(content_bytes) / (1024 * 1024):.2f} MB")
    with open(raw_csv_path, "wb") as f:
        f.write(content_bytes)

    # Parse CSV
    content_text = content_bytes.decode("utf-8", errors="replace")
    reader = csv.DictReader(io.StringIO(content_text))
    
    tramites_full = []
    tramites_resumen = []

    for row in reader:
        tid = row.get("id", "").strip()
        titulo = clean_text(row.get("nombre_tramite", ""))
        url = row.get("url", "").strip()
        if not titulo or not url:
            continue

        organismo = clean_text(row.get("institucion_nombre", ""))
        organismo_padre = clean_text(row.get("institucion_padre_organizacional_nombre", ""))
        descripcion = clean_text(row.get("ques_es", ""))
        tags = clean_tags(row.get("categorias_de_organismo", ""))
        canales = [c.strip() for c in row.get("canales_de_atencion", "").split(",") if c.strip()]
        
        url_en_linea = row.get("internet_url_del_tramite", "").strip()
        en_linea_disp = bool("internet" in canales or url_en_linea)
        
        costo_info = parse_cost(row)

        tramite_obj = {
            "id": tid,
            "titulo": titulo,
            "url": url,
            "organismo": organismo,
            "organismo_padre": organismo_padre,
            "descripcion": descripcion,
            "tags": tags,
            "canales": canales,
            "en_linea": {
                "disponible": en_linea_disp,
                "url_inicio": url_en_linea if url_en_linea else None,
                "requisitos": clean_text(row.get("internet_requisitos", "")),
                "como_se_hace": clean_text(row.get("internet_como_se_hace", ""))
            },
            "presencial": {
                "requisitos": clean_text(row.get("persona_requisitos", "")),
                "como_se_hace": clean_text(row.get("persona_como_se_hace", "")),
                "direcciones": clean_text(row.get("persona_direcciones_listado_de_direcciones", "")),
                "otras_direcciones": clean_text(row.get("persona_direcciones_otros_direcciones", ""))
            },
            "telefono": {
                "requisitos": clean_text(row.get("telefono_requisitos", "")),
                "como_se_hace": clean_text(row.get("telefono_como_se_hace", ""))
            },
            "requisitos_generales": clean_text(row.get("requisitos_generales", "")),
            "costo": costo_info,
            "otros_datos_de_interes": clean_text(row.get("otros_datos_de_interes", "")),
            "email_consulta": row.get("email_de_consulta", "").strip(),
            "creado": row.get("creado", "").strip(),
            "actualizado": row.get("actualizado", "").strip()
        }
        tramites_full.append(tramite_obj)

        desc_corta = (descripcion[:220] + "...") if len(descripcion) > 220 else descripcion
        tramites_resumen.append({
            "id": tid,
            "titulo": titulo,
            "url": url,
            "organismo": organismo,
            "organismo_padre": organismo_padre,
            "descripcion_corta": desc_corta,
            "en_linea": en_linea_disp,
            "tiene_costo": costo_info["tiene_costo"],
            "tags": tags,
            "actualizado": row.get("actualizado", "").strip()
        })

    # Guardar JSON completo
    with open(full_json_path, "w", encoding="utf-8") as f:
        json.dump(tramites_full, f, ensure_ascii=False, indent=2)
    print(f"JSON completo guardado: {full_json_path} ({len(tramites_full)} trámites)")

    # Guardar JSON resumen
    with open(summary_json_path, "w", encoding="utf-8") as f:
        json.dump(tramites_resumen, f, ensure_ascii=False, indent=2)
    print(f"JSON resumen guardado: {summary_json_path} ({len(tramites_resumen)} trámites)")

    # Guardar en SQLite con Full Text Search (FTS5)
    if os.path.exists(db_path):
        os.remove(db_path)
    
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE tramites (
        row_id INTEGER PRIMARY KEY AUTOINCREMENT,
        id TEXT,
        titulo TEXT,
        url TEXT,
        organismo TEXT,
        organismo_padre TEXT,
        descripcion TEXT,
        tags TEXT,
        en_linea INTEGER,
        tiene_costo INTEGER,
        costo_valor TEXT,
        costo_unidad TEXT,
        url_inicio TEXT,
        email_consulta TEXT,
        actualizado TEXT,
        raw_json TEXT
    )
    """)

    cur.execute("""
    CREATE VIRTUAL TABLE tramites_fts USING fts5(
        row_id UNINDEXED,
        id UNINDEXED,
        titulo,
        organismo,
        organismo_padre,
        descripcion,
        tags,
        requisitos
    )
    """)

    for t in tramites_full:
        cur.execute("""
        INSERT INTO tramites (id, titulo, url, organismo, organismo_padre, descripcion, tags, en_linea, tiene_costo, costo_valor, costo_unidad, url_inicio, email_consulta, actualizado, raw_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            t["id"],
            t["titulo"],
            t["url"],
            t["organismo"],
            t["organismo_padre"],
            t["descripcion"],
            ", ".join(t["tags"]),
            1 if t["en_linea"]["disponible"] else 0,
            1 if t["costo"]["tiene_costo"] else 0,
            t["costo"]["valor"],
            t["costo"]["unidad"],
            t["en_linea"]["url_inicio"],
            t["email_consulta"],
            t["actualizado"],
            json.dumps(t, ensure_ascii=False)
        ))
        row_id = cur.lastrowid

        reqs = f"{t['requisitos_generales']} {t['en_linea']['requisitos']} {t['presencial']['requisitos']}".strip()
        cur.execute("""
        INSERT INTO tramites_fts (row_id, id, titulo, organismo, organismo_padre, descripcion, tags, requisitos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            row_id,
            t["id"],
            t["titulo"],
            t["organismo"],
            t["organismo_padre"],
            t["descripcion"],
            ", ".join(t["tags"]),
            reqs
        ))

    conn.commit()
    conn.close()
    print(f"Base de datos SQLite con FTS5 generada: {db_path}")
    print("¡Procesamiento completo finalizado con éxito!")

if __name__ == "__main__":
    main()
