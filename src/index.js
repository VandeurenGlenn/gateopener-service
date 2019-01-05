import Renderer from './../node_modules/custom-renderer-mixin/src/render-mixin.js';
import CSS from './../node_modules/backed/src/mixins/css-mixin.js';
import define from './../node_modules/backed/src/utils/define.js';

export default define(class GateopenerService extends CSS(Renderer(HTMLElement)) {
  constructor() {
    super()

    this.attachShadow({mode: 'open'});
    this._click = this._click.bind(this)
  }

  connectedCallback() {
    super.connectedCallback();
      firebase.auth().onAuthStateChanged(user => {
        if (!user) this.signinDialog()
        else {
          this.ref = firebase.database().ref(`${user.uid}`);
        }
      });
      try {
        this.app = firebase.app();
        let features = ['auth', 'database'].filter(feature => typeof this.app[feature] === 'function');
      } catch (e) {
        console.error(e);
        document.innerHTML = 'Error loading the Firebase SDK, check the console.';
      }

      this.shadowRoot.querySelector('button').addEventListener('click', this._click)
  }

  _click() {
    this.ref.once('value').then(snap => {
      if (!snap.val().value) return this.ref.update({value: true})
      else this.ref.update({value: false});
    })
  }

  signinDialog() {
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    const uiconfig = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          this.classList.remove('hidden');
          return false;
        },
        uiShown: () => {
          this.classList.add('hidden')
        }
      },
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ]
    };
    ui.start('#firebaseui-auth-container', uiconfig);
  }

  get template() {
    return html`
      <style>
        :host {
          display: flex;
        }

        apply(--css-hero)

        .signin-dialog {
          opacity: 0;
          pointer-events: none;
        }

        .opened {
          opacity: 1;
          pointer-events: auto;
        }

        .rounded {
          border-radius: 10px;
        }

        .hero {
          background: none;
          align-items: center;
          justify-content: center;

          height: 48px;
          width: 96px;
        }

        button {
          border: none;
          background: transparent;
          user-select: none;
          outline: none;
          cursor: pointer;
        }
      </style>

      <button class="rounded hero">
        open gate
      </button>
    `;
  }
})
