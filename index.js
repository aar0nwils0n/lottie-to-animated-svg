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
          var animation = bodymovin.loadAnimation({
            container: lottieContainer, // Required
            animationData: doc,
            renderer: 'svg', // Required
            loop: false, // Optional
            autoplay: false, // Optional
            name: "Hello World", // Name for future reference. Optional.
          })

          let step = 0;


          animation.goToAndStop(0, false)



          function next() {
            if(step >= total) {
                const textarea = document.createElement('textarea');
                textarea.innerHTML = svgContainer.childNodes[0].outerHTML
                    .replaceAll('attributename', 'attributeName')
                    .replaceAll('calcmode', 'calcMode')
                    .replaceAll('keytimes', 'keyTimes')
                    .replaceAll('animatetransform', 'animateTransform')
                    .replaceAll('attributetype', 'attributeType')
                    .replaceAll('animatetransform', 'animateTransform')
                document.body.appendChild(textarea)
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

    

          const observer = new MutationObserver((mutationsList) => {
            for(const mutation of mutationsList) {
                const oldAnimate = svgContainer.querySelector(`animate[href="#${mutation.target.id}"][attributename="${mutation.attributeName}"]`)

                if(oldAnimate) {
                    if(oldAnimate.getAttribute('values') === null) console.log(oldAnimate.getAttributeNames())
                    oldAnimate.setAttribute('values', oldAnimate.getAttribute('values') + ';' + mutation.target.getAttribute(mutation.attributeName))
                    oldAnimate.setAttribute('keytimes', oldAnimate.getAttribute('keytimes') + ';' + step / total)
                } else if(mutation.target.getAttribute(mutation.attributeName) === null) console.log(mutation)
                    const animation = document.createElement('animate')
                    animation.setAttribute('begin', step * frameDur + 'ms');
                    animation.setAttribute('href', '#' + mutation.target.id)
                    animation.setAttribute('attributeName', mutation.attributeName)
                    animation.setAttribute('values', mutation.target.getAttribute(mutation.attributeName))
                    animation.setAttribute('keytimes', 0)
                    animation.setAttribute('calcMode', 'discrete')
                    animation.setAttribute('fill', 'freeze')
                    animation.setAttribute('dur', `${total * frameDur}ms`)
                    svgContainer.childNodes[0].appendChild(animation)
                }
          });

          observer.observe(lottieContainer, { attributes: true,  subtree: true });

          next()
        });
        reader.readAsText(doc);
    })
    document.body.appendChild(uploadDoc)
    
    
}

document.addEventListener('DOMContentLoaded', init)
