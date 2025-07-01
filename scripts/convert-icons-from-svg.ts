import fs from 'fs-extra'
import path from 'path'
import { optimize } from 'svgo'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import iconGen from 'icon-gen'

const svgPath = path.resolve('public/assets/favicons/icon.svg')
const outputDir = path.resolve('public/assets/favicons')

const fixedSvgPath = path.join(outputDir, 'fixed-icon.svg')
const pngPath = path.join(outputDir, '512x512.png')
const icoPath = path.join(outputDir, 'icon.ico')
const icnsPath = path.join(outputDir, 'icon.icns')

async function convertSvgToIcons() {
	try {
		const svgRaw = await fs.readFile(svgPath, 'utf-8')

		console.log('🧼 Otimizando e reescalando SVG com SVGO...')
		const { data: optimizedSvg } = optimize(svgRaw, {
			multipass: true,
			plugins: [
				{
					name: 'preset-default',
					params: {
						overrides: {
							removeViewBox: false
						}
					}
				},
				{
					name: 'removeDimensions'
				}
			]
		})

		await fs.writeFile(fixedSvgPath, optimizedSvg)
		console.log('✅ SVG otimizado salvo em:', fixedSvgPath)

		console.log('🎨 Convertendo para PNG 512x512...')
		const pngBuffer = await sharp(Buffer.from(optimizedSvg))
			.resize(512, 512, {
				fit: 'contain',
				background: { r: 0, g: 0, b: 0, alpha: 0 }
			})
			.png()
			.toBuffer()
		await fs.writeFile(pngPath, pngBuffer)
		console.log('✅ PNG salvo em:', pngPath)

		console.log('📦 Gerando ICO...')
		const icoBuffer = await pngToIco(pngBuffer)
		await fs.writeFile(icoPath, icoBuffer)
		console.log('✅ ICO salvo em:', icoPath)

		console.log('🍏 Gerando ICNS...')
		await iconGen(pngPath, outputDir, { modes: ['icns'], report: true } as any)
		const autoIcns = path.join(outputDir, '512x512.icns')
		if (await fs.pathExists(autoIcns)) {
			await fs.rename(autoIcns, icnsPath)
			console.log('✅ ICNS renomeado para:', icnsPath)
		}


		console.log('\n🧪 Gerando estrutura de ícones Linux...');
		const linuxSizes = [16, 32, 48, 64, 128, 256, 512];
		const linuxBaseDir = path.join(outputDir, 'linux-icons');

		await fs.ensureDir(linuxBaseDir);


		for (const size of linuxSizes) {
			const outputFile = path.join(linuxBaseDir, `${size}x${size}.png`);


			await sharp(pngBuffer)
				.resize(size, size)
				.toFile(outputFile);

			console.log(`🖼️  ${size}x${size} gerado`);
		}

		console.log('\n🚀 Ícones gerados com sucesso, mo! Pode buildar sem medo 💜');
	} catch (err) {
		console.error('❌ Erro:', err)
	}
}

convertSvgToIcons()
