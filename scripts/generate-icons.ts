const path = require("node:path");
const fs = require("node:fs");

const getFileNameWithoutExt = (rawPath: string): string => {
  const normalizedPath = path.normalize(rawPath);
  return path.basename(normalizedPath, path.extname(normalizedPath));
};

const kebabToCamel = (input: string) => {
	return input.replace(/-([a-zA-Z0-9])/g, (_, char) => char.toUpperCase());
};

const generateIconAsConst = (constName: string, content: string) => {
    const lines = [`export const ${constName} = \``];

    lines.push(content.trim());
    lines.push('\`;\n');

    return lines.join('\n');
}

const generateIconsMapping = (icons: { path: string; content: string; constName: string; fileName: string }[]) => {
    const lines: string[] = [];

    icons.forEach(icon => {
        lines.push(`import { ${icon.constName} } from './${icon.fileName.replace('.ts', '')}';`);
    });

    lines.push('', '');

    lines.push('export const iconsMapping = {');

    icons.forEach(icon => {
        lines.push(`    '${icon.fileName.replace('.ts', '')}': ${icon.constName},`);
    });

    lines.push("};\n");

    return lines.join('\n');
}

const generateIcons = () => {
    const assetsPath = path.resolve(`assets/app-icons`);
    const interfaceIconsPath = path.resolve(`src/web/app/shared/static/icons`);

    if (!fs.existsSync(interfaceIconsPath)) {
        fs.mkdirSync(interfaceIconsPath);
    }

    const files = fs.readdirSync(assetsPath) as string[];

    const result = files.map((file: any) => {
        const iconPath = path.join(assetsPath, file);

        const content = fs.readFileSync(iconPath, 'utf-8');

        return {
            path: iconPath as string,
            content: content as string,
        }
    });

    const constIcons = result.map((icon) => {
        const newPath = icon.path.replace(assetsPath, interfaceIconsPath).replace("svg", "ts");
        const fileName = getFileNameWithoutExt(newPath);

        const constName = kebabToCamel(fileName.replace(".ts", ""));

        const result = generateIconAsConst(constName, icon.content);

        return {path: newPath, content: result, constName, fileName};
    });

    for (const constIcon of constIcons) {
        fs.writeFileSync(constIcon.path, constIcon.content);
    }

    const iconsMappingPath = `${interfaceIconsPath}/icons-mapping.ts`;
    const content = generateIconsMapping(constIcons);

    fs.writeFileSync(iconsMappingPath, content);
}

generateIcons();
