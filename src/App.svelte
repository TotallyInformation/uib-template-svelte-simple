<header>
	<h1 class="with-subtitle">UIBUILDER for Node-RED + Svelte</h1>
	<div role="doc-subtitle">Using the uibuilder IIFE library.</div>
</header>

<main>
	<!-- '#more' is used as a parent for dynamic HTML content in examples
		 Also, send {topic:"more", payload:"Hello from <b>Node-RED</b>"} to auto-display the payload -->
	<div id="more" uib-topic="more"></div>

	<article>
		<div>
			Five files in the <code>src</code> folder are used to create this page:
			<ul>
				<li><code>App.svelte</code> - defines the dynamic page HTML, CSS and JS.</li>
				<li><code>main.js</code> - the controlling JavaScript file that loads the app and sets data properties.</li>
				<li><code>index.html</code> - the static HTML file that hosts everything.</li>
				<li><code>global.css</code> - the static CSS file that is used by all components.</li>
				<li><code>favicon.png</code> - the favicon used by the app.</li>
			</ul>
		</div>
		<hr>
		<p>A dynamic greeting initially set in <code>App.svelte</code>, can be updated using a msg from Node-RED:<p>
		<p style="background-color:var(--surface1)">{myGreeting}</p>
		<p>Another dynamic property set in <code>main.js</code> this time:</p>
		<p style="background-color:var(--surface1)">{anotherProp}</p>
	</article>

	<!-- A form is an easy way to input data to send to Node-RED -->
	<form>
		<div>
			This is a form element. It is an easy way to get input and send it back to Node-RED.
		</div>

		<div><!-- Accessible form element -->
			<label for="quickMsg">Quick Message:</label>
			<!-- onchange/onfocus is optional, they save the previous value of the field -->
			<input id="quickMsg" value="A message from the browser" onchange="this.uib_newValue = this.value" onfocus="this.uib_oldValue = this.value">
		</div>

		<div>
			<label for="userName">Your Name:</label>
			<input id="userName" placeholder="Enter your name">
		</div>

		<div>
			<label for="userAge">Your Age: <output id="ageValue">30</output></label>
			<input id="userAge" type="range" min="10" max="110" value="30" step="1" 
				oninput="$('#ageValue').textContent = this.value">
		</div>

		<div>
			<!-- Send data back to Node-RED the simple way - automatically includes the form's inputs,
				`data-*` attributes, keyboard modifiers, etc. Also works with other event types. -->
			<button on:click={uibsend} data-greeting="{myGreeting}"  data-type="eventSend" data-foo="Bah" type="button"
					title="Uses the uibuilder.eventSend fn and sents both static and dynamic data back to Node-RED">
				Send form details back to Node-RED using uibuilder.eventSend
			</button>
		</div>
	</form>

	<!-- Another way to send custom data back to Node-RED. fnSendToNR is defined in index.js,
		it uses the standard `uibuilder.send` function -->
	<button on:click={ e => sendToNR('A message from the sharp end!') } type="button">Send a msg back to Node-RED using a custom function and <code>uibuilder.send</code></button>

</main>

<style>
	/* These styles will be constrained just to this component by Svelte.
	 * Use the dist/global.css file for any definitions you want shared by all components.
	 *   That is a good place to import uibuilder's uib-styles.css for example.
	 *   If you do, then you can use the CSS variables defined there in here as well.
	 */
</style>

<script>
	// @ts-nocheck
	
	/** This .svelte file is the master, top-level App. Use it to define everything else.
	 * It is treated as a module so no need to 'use strict' and you can use the import statement.
	 * This app is based on the sveltejs/template package and the uibuilder simple IIFE template.
	 * logLevel and showMsg can be controlled from Node-RED instead of here if preferred.
	 */

	// import { onMount } from 'svelte'

	//#region ---- These are "props" - variables that can be used in a parent component when mounting this component & used in the UI ----
	// Exported function props - only need to export fns if you want to use them outside this file
	export let uibsend
	export let sendToNR
	// Exported data props
	export let myGreeting = 'Hello there from App.svelte! Send me a msg containing msg.greeting to replace this text.'
	// Defined in main.js
	export let anotherProp = '--'
	//#endregion ---- ---- ----
	
	// logLevel 2+ shows more built-in logging. 0=error,1=warn,2=info,3=log,4=debug,5=trace.
	// uibuilder.set('logLevel', 2) // uibuilder.set('logLevel', 'info')
	// Using the log output yourself:
	// uibuilder.log('info', 'a prefix', 'some info', {any:'data',life:42})

	// A global helper function to send a message back to Node-RED using the standard uibuilder send function
	sendToNR = function fnSendToNR(payload) {
		uibuilder.send({
			'topic': 'msg-from-uibuilder-front-end',
			'payload': payload,
		})
	}

	// A convenient global send function that can be wired direct to events - defined as a prop above
	// Has to bind to the correct `this` object and send the hidden `event` property
	uibsend = uibuilder.eventSend.bind(uibuilder)

	// Listen for new messages from Node-RED/uibuilder
	uibuilder.onChange('msg', (msg) => {	
		// Update the greeting if present in the msg
		if ( msg.greeting ) myGreeting = msg.greeting
	})

</script>
