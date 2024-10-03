import Modal from "@/components/Modal";
import React from "react";
import ReactDOM from "react-dom/client";
import reactDOMtemp from "react-dom";
import { ContentScriptContext } from "wxt/client";


// // Inject the pen icon into the LinkedIn reply box
// const injectPenIcon = (ctx: ContentScriptContext, replyBox: Element) => {
//   console.log('Injecting pen icon');
//   const penIcon = document.createElement('div');
//   penIcon.id = 'pen-icon';
//   penIcon.className = 'absolute bottom-0 right-0 m-2 cursor-pointer z-50';
//   penIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20h9M16.5 3.5a2.121 2.121 0 00-3 0L4 13v4h4l9.5-9.5a2.121 2.121 0 000-3z" /></svg>`;

//   // penIcon.onclick = () => {
//   //   // Show the modal when the pen icon is clicked
//   //   return showModal(ctx, replyBox);
//   // };

//   return showModal(ctx, replyBox);

//   replyBox.appendChild(penIcon);
// };

// Function to show the modal
const showModal = async (ctx: ContentScriptContext, replyBox: Element, observer: MutationObserver) => {
  const handleInsert = (text: string) => {
    console.log('inserted: script');
    const textArea = replyBox.querySelector('div[role="textbox"]');
    if (textArea) {
      (textArea as HTMLElement).innerText += text;
    }
    handleClose();
  };

  const handleClose = () => {
    console.log('closed: script');
    observer.observe(document.body, { childList: true, subtree: true });
  };
  
  observer.disconnect();

  const ui = await createUi(ctx, handleInsert, handleClose);
  ui.mount();
};

export default defineContentScript({
  matches: ["*://www.linkedin.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    console.log('LinkedIn content script loaded');
    // Wait for the LinkedIn reply box to appear
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          console.log('Mutation detected');
          const replyBox = document.querySelector('[aria-label="Write a message…"]');
          if (replyBox && !document.querySelector('#linkedin-popup-modal')) {
            console.log('Reply box found');
            const intersectionObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  console.log('Reply box is visible');
                  showModal(ctx, replyBox, observer);
                  intersectionObserver.disconnect();
                }
              });
            });

            intersectionObserver.observe(replyBox);
          }
        }
      });
    });

    // Start observing the DOM
    observer.observe(document.body, { childList: true, subtree: true });
  },
});


function createUi(ctx: ContentScriptContext, onInsert: (text: string) => void, onClose: () => void) {
  return createShadowRootUi(ctx, {
    name: "linkedin-example",
    position: "inline",
    append: "first",
    onMount(uiContainer, shadow) {
      const app = document.createElement("div");
      uiContainer.append(app);

      // Create a root on the UI container and render a component
      const root = ReactDOM.createRoot(app);
      root.render(
        <React.StrictMode>
          <Modal
            onInsert={onInsert}
            onClose={() => {
              root.unmount();
              onClose();
            }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: '1001',
              backgroundColor: 'white',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              width: '80%',
              maxWidth: '500px',
              height: 'auto',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            overlayStyle={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: '1000',
              pointerEvents: 'none',
            }}
          />
        </React.StrictMode>,
      );
      return root;
    },
    onRemove(root) {
      root?.unmount();
    },
  });
}