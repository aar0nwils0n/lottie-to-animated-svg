function init() {
    const uploadDoc = document.createElement('input')
    uploadDoc.setAttribute('type', 'file')
    uploadDoc.setAttribute('accept', '.json')

    const lottieContainer = document.createElement('div');
    const svgContainer = document.createElement('div')

    uploadDoc.addEventListener('change', () => {
        const doc = uploadDoc.files[0];

        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            document.body.appendChild(lottieContainer)
            document.body.appendChild(svgContainer)
            const doc = JSON.parse(event.target.result);
            let frameDur = 1000 / doc.fr
            let total = doc.op
            const animation = bodymovin.loadAnimation({
                container: lottieContainer, // Required
                animationData: doc,
                renderer: 'svg', // Required
                loop: false, // Optional
                autoplay: false, // Optional
                name: "Hello World", // Name for future reference. Optional.
            })

            let step = 0;


            animation.goToAndStop(1, false)



            function next() {
                if (step >= total) {
                    const textarea = document.createElement('textarea');
                    const newSvg = svgContainer.childNodes[0].outerHTML
                        .replaceAll('attributename', 'attributeName')
                        .replaceAll('calcmode', 'calcMode')
                        .replaceAll('keytimes', 'keyTimes')
                        .replaceAll('animatetransform', 'animateTransform')
                        .replaceAll('attributetype', 'attributeType')
                        .replaceAll('animatetransform', 'animateTransform')
                    textarea.innerHTML = newSvg
                    // svgContainer.innerHTML = newSvg
                    document.body.insertBefore(textarea, lottieContainer)
                    return
                }
                animation.goToAndStop(step * frameDur, false)
                window.requestAnimationFrame(next)
                step++
            }


            new Array(...lottieContainer.querySelectorAll('*')).forEach((el, i) => {
                el.setAttribute('id', `el-${i}`)
            })


            svgContainer.innerHTML = lottieContainer.innerHTML

            function setExistingSetAttributes(newValue, el) {
                const newValues = el.getAttribute('values') + ';' + newValue;
                const newValuesList = newValues.split(';')
                const newKeyTimes = newValuesList.map((_, i) => i / (newValuesList.length - 1)).join(';')
                el.setAttribute('values', newValues)
                el.setAttribute('keytimes', newKeyTimes)
                const start = Number(el.getAttribute('begin').replace('ms', ''))
                el.setAttribute('dur', `${step * frameDur - start}ms`)
            }

            const styles = {}



            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.attributeName === 'style') {
                        styles[mutation.target.id] = {
                            ...(styles[mutation.target.id] && mutation.oldValue ? {} : {
                                0: mutation.oldValue
                            }),
                            [(100 * step / total).toFixed(0)]: mutation.target[mutation.attributeName].cssText
                        }

                        const id = `${mutation.target.id}-animate`;

                        const style = (() => {
                            const oldStyle = document.getElementById(id);

                            if (oldStyle) {
                                return oldStyle
                            } else {
                                const style = document.createElement('style');
                                style.setAttribute('id', id)
                                svgContainer.childNodes[0].appendChild(style)

                                return style
                            }
                        })()

                        style.innerHTML = `
                        
                        
                        @keyframes ${id} {
                            ${Object.entries(styles[mutation.target.id]).reduce((acc, [percent, value]) => {
                            return acc + `
                                ${percent}% {
                                        ${value}
                                    }
                                `
                            }, '')}
                        }`

                        svgContainer.querySelector(`#${mutation.target.id}`).setAttribute('style', `animation-name: ${id}; animation-duration: ${Math.round(total * frameDur)}ms`)


                    } else if (mutation.attributeName === 'transform' && mutation.target.getAttribute(mutation.attributeName).includes('matrix')) {

                        const matrix = mutation.target.getAttribute(mutation.attributeName)
                            .replace('matrix(', '').replace(')', '').split(',')

                        const [a, c, d, b, tx, ty] = matrix;


                        const translate = [tx, ty]

                        const sx = Math.sqrt(Math.pow(a, 2) + Math.pow(c, 2))
                        const sy = Math.sqrt(Math.pow(b, 2) + Math.pow(d, 2))

                        const scale = [sx, sy]

                        const oldTranslate = svgContainer.querySelector(`animatetransform[href="#${mutation.target.id}"][attributename="${mutation.attributeName}"][type="translate"]`)

                        if (oldTranslate) {
                            setExistingSetAttributes(translate.join(' '), oldTranslate)
                        } else {
                            const translateEl = document.createElement('animateTransform')
                            translateEl.setAttribute('attributeName', mutation.attributeName)
                            translateEl.setAttribute('values', translate.join(' '))
                            translateEl.setAttribute('keytimes', 0)
                            translateEl.setAttribute('begin', `${(step - 1) * frameDur}ms`)
                            translateEl.setAttribute('href', '#' + mutation.target.id)
                            translateEl.setAttribute('fill', 'freeze')
                            translateEl.setAttribute('type', 'translate')
                            translateEl.setAttribute('attributeType', 'XML')
                            translateEl.setAttribute('additive', 'sum')
                            translateEl.setAttribute('dur', `${total * frameDur}ms`)
                            svgContainer.childNodes[0].appendChild(translateEl)
                        }

                        const oldScale = svgContainer.querySelector(`animatetransform[href="#${mutation.target.id}"][attributename="${mutation.attributeName}"][type="scale"]`)

                        if (oldScale) {
                            setExistingSetAttributes(scale.join(' '), oldScale)
                        } else {
                            const scaleEl = document.createElement('animateTransform')
                            scaleEl.setAttribute('attributeName', mutation.attributeName)
                            scaleEl.setAttribute('values', scale.join(' '))
                            scaleEl.setAttribute('keytimes', 0)
                            scaleEl.setAttribute('begin', `${(step - 1) * frameDur}ms`)
                            scaleEl.setAttribute('href', '#' + mutation.target.id)
                            scaleEl.setAttribute('fill', 'freeze')
                            scaleEl.setAttribute('type', 'scale')
                            scaleEl.setAttribute('attributeType', 'XML')
                            scaleEl.setAttribute('additive', 'sum')
                            svgContainer.childNodes[0].appendChild(scaleEl)
                        }

                    } else {

                        const oldAnimate = svgContainer.querySelector(`animate[href="#${mutation.target.id}"][attributename="${mutation.attributeName}"]`)
                        if (oldAnimate) {
                            setExistingSetAttributes(mutation.target.getAttribute(mutation.attributeName), oldAnimate)
                        } else {
                            const animation = document.createElement('animate')
                            animation.setAttribute('begin', (step - 1) * frameDur + 'ms');
                            animation.setAttribute('href', '#' + mutation.target.id)
                            animation.setAttribute('attributeName', mutation.attributeName)
                            animation.setAttribute('values', mutation.target.getAttribute(mutation.attributeName))
                            animation.setAttribute('keytimes', 0)
                            animation.setAttribute('calcMode', 'discrete')
                            animation.setAttribute('fill', 'freeze')
                            animation.setAttribute('dur', `${total * frameDur}ms`)
                            svgContainer.childNodes[0].appendChild(animation)
                        }

                    }
                }
            });

            observer.observe(lottieContainer, { attributes: true, subtree: true, attributeOldValue: true });

            next()
        });
        reader.readAsText(doc);
    })
    document.body.appendChild(uploadDoc)


}

document.addEventListener('DOMContentLoaded', init)
