import fs from 'fs';

const content = fs.readFileSync('/Users/fengguangmi/Downloads/data.csv', 'utf8');
const lines = content.trim().split('\n').map(l => l.trim()).filter(l => l);

const data = [];
for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 3) {
        data.push({ id: parts[0], name: parts[1], parentId: parts[2] });
    }
}

const map = {};
const root = [];

data.forEach(item => {
    map[item.id] = { value: item.id, label: item.name };
});

data.forEach(item => {
    if (item.parentId === '0' || !map[item.parentId]) {
        root.push(map[item.id]);
    } else {
        if (!map[item.parentId].children) {
            map[item.parentId].children = [];
        }
        map[item.parentId].children.push(map[item.id]);
    }
});

fs.writeFileSync('/Users/work/XXFGM/设计文件/AI原型-反重力/src/pages/law-enforcement-statistics/agencyData.ts', 'export const agencyData = ' + JSON.stringify(root, null, 2) + ';\n');
console.log('Conversion successful. Output to agencyData.ts');
