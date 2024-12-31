/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './ui.css';
function App() {
    const inputRef = React.useRef(null);
    const onCreate = () => {
        var _a;
        const count = Number(((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.value) || 0);
        parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*');
    };
    const onCancel = () => {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
    };
    return (React.createElement("main", null,
        React.createElement("header", null,
            React.createElement("img", { src: require('./logo.svg') }),
            React.createElement("h2", null, "Rectangle Creator")),
        React.createElement("section", null,
            React.createElement("input", { id: "input", type: "number", min: "0", ref: inputRef }),
            React.createElement("label", { htmlFor: "input" }, "Rectangle Count")),
        React.createElement("footer", null,
            React.createElement("button", { className: "brand", onClick: onCreate }, "Create"),
            React.createElement("button", { onClick: onCancel }, "Cancel"))));
}
ReactDOM.createRoot(document.getElementById('react-page')).render(React.createElement(App, null));
