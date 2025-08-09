import os
import json

def generate_folders_json(base_dir='.'):
    folders = []
    for name in os.listdir(base_dir):
        path = os.path.join(base_dir, name)
        if os.path.isdir(path):
            index_path = os.path.join(path, 'index.html')
            if os.path.isfile(index_path):
                folders.append(name)
    with open('folders.json', 'w', encoding='utf-8') as f:
        json.dump(folders, f, ensure_ascii=False, indent=2)
    print(f'生成 folders.json，包含文件夹：{folders}')

if __name__ == '__main__':
    generate_folders_json()
