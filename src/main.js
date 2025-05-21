import App from './App.svelte'

const target = document.getElementById('app')
if (!target) {
    // Oh, oh. I made a mistake!
    throw new Error(`Target element id="app" not found`)
} else {
    // Empty the target element
    target.innerHTML = ''
}

const app = new App({
    // target: document.body,
    target: target,
    props: {
        anotherProp: 'I am from a prop set in main.js.' 
    }
})

export default app
