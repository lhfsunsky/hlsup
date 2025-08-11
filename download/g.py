import os
import json

def generate_folders_json(base_dir='.'):
    folders = []

    for root, dirs, files in os.walk(base_dir):
        # 跳过当前目录（防止列出本页面自身的 HTML）
        if root == base_dir:
            continue

        html_files = [f for f in files if f.lower().endswith('.html')]
        if html_files:
            # 相对于 base_dir 的路径
            rel_path = os.path.relpath(root, base_dir)
            folders.append({
                "folder": rel_path,
                "html_files": html_files
            })

    with open('folders.json', 'w', encoding='utf-8') as f:
        json.dump(folders, f, ensure_ascii=False, indent=2)

    print(f'生成 folders.json，包含 {len(folders)} 个目录')

if __name__ == '__main__':
    generate_folders_json()
