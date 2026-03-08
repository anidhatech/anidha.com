#!/usr/bin/env python3
import os
import xml.etree.ElementTree as ET
from datetime import datetime

BASE_URL = "https://anidha.com"
PUBLIC_DIR = "public"

# Priority mapping
PRIORITIES = {
    "/": 1.0,
    "/services.html": 0.9,
    "/solutions.html": 0.9,
    "/case-studies.html": 0.8,
    "/about.html": 0.7,
    "/contact.html": 0.6,
    "/blog/": 0.9,
}

def create_urlset():
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    # Add static pages
    for page in PRIORITIES:
        url = ET.SubElement(urlset, "url")
        loc = ET.SubElement(url, "loc")
        loc.text = f"{BASE_URL}{page}"
        priority = ET.SubElement(url, "priority")
        priority.text = str(PRIORITIES[page])
        changefreq = ET.SubElement(url, "changefreq")
        if PRIORITIES[page] >= 0.9:
            changefreq.text = "weekly"
        else:
            changefreq.text = "monthly"

    # Add blog posts
    blog_dir = os.path.join(PUBLIC_DIR, "blog", "articles")
    if os.path.exists(blog_dir):
        for filename in os.listdir(blog_dir):
            if filename.endswith(".html"):
                slug = filename.replace(".html", "")
                url = ET.SubElement(urlset, "url")
                loc = ET.SubElement(url, "loc")
                loc.text = f"{BASE_URL}/blog/articles/{slug}"
                priority = ET.SubElement(url, "priority")
                priority.text = "0.7"
                changefreq = ET.SubElement(url, "changefreq")
                changefreq.text = "weekly"

    return urlset

def main():
    urlset = create_urlset()
    tree = ET.ElementTree(urlset)

    # Pretty print
    ET.indent(urlset)

    output_path = os.path.join(PUBLIC_DIR, "sitemap.xml")
    tree.write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Sitemap generated: {output_path}")

if __name__ == "__main__":
    main()
