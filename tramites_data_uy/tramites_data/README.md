# Catálogo de Trámites de Uruguay (gub.uy)

Este directorio contiene el conjunto de datos completo, normalizado y optimizado de los **3.520 trámites y servicios del Estado uruguayo**, procesado a partir de la fuente oficial de AGESIC (Catálogo Nacional de Datos Abiertos de Uruguay).

---

## 📁 Archivos Disponibles

| Archivo | Tamaño aprox. | Descripción |
|---|---|---|
| [`tramites_completo.json`](./tramites_completo.json) | ~10.8 MB | JSON con **todos los campos detallados** (requisitos generales, requisitos online, pasos presenciales, costos, URLs, contactos, etc.). |
| [`tramites_resumen.json`](./tramites_resumen.json) | ~2.2 MB | Versión liviana ideal para interfaces web o móviles, motores de búsqueda cliente o precargas rápidas en juegos/aplicaciones. |
| [`tramites.db`](./tramites.db) | ~23.8 MB | Base de datos SQLite con tabla virtual **FTS5 (Full-Text Search)** y ranking por relevancia **BM25**. Consultas en milisegundos. |
| [`tramites_oficial_raw.csv`](./tramites_oficial_raw.csv) | ~10.1 MB | Archivo original descargado directamente de Datos Abiertos. |
| [`buscar.py`](./buscar.py) | ~4 KB | Script CLI y módulo reutilizable en Python para buscar trámites. |

---

## 🚀 Uso Rápido del Buscador CLI

Puedes hacer búsquedas desde la terminal con filtros:

```bash
# Búsqueda por palabras clave (usa relevancia BM25)
python tramites_data/buscar.py "residencia"

# Buscar trámites con detalle completo (requisitos, cómo se hace, emails)
python tramites_data/buscar.py "vinculo uruguayo" --detalle

# Filtrar solo trámites que se pueden iniciar por internet
python tramites_data/buscar.py "cedula" --en-linea

# Filtrar por organismo o ministerio
python tramites_data/buscar.py "pasaporte" --organismo "Ministerio del Interior"

# Trámites gratuitos
python tramites_data/buscar.py "partida" --gratis
```

---

## 🐍 Uso en Python

```python
from tramites_data.buscar import buscar_tramites

# Búsqueda rápida
resultados = buscar_tramites(
    query="residencia permanente",
    en_linea=True,
    limit=5
)

for t in resultados:
    print(t["titulo"], "->", t["url"])
```

---

## 🎮 Uso en Godot (GDScript)

Si estás integrando esto en tu proyecto Godot (`Exhume.edu`), puedes cargar el resumen o el JSON completo directamente:

```gdscript
extends Node

func cargar_tramites():
    var file = FileAccess.open("res://tramites_data/tramites_resumen.json", FileAccess.READ)
    if file:
        var json_text = file.get_as_text()
        var tramites = JSON.parse_string(json_text)
        print("Total de trámites cargados: ", tramites.size())
        
        # Ejemplo: Buscar en GDScript
        for t in tramites:
            if "residencia" in t["titulo"].to_lower():
                print("Encontrado: ", t["titulo"], " - En línea: ", t["en_linea"])
```

---

## 🔄 Actualización de Datos

Para refrescar la base de datos con los últimos trámites oficiales publicados por AGESIC en cualquier momento:

```bash
python tools/descargar_procesar_tramites.py
```
