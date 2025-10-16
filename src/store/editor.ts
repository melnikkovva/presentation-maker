import type { Presentation } from "./types/types_of_presentation";
import { maximalPresentation } from "./data/tests_data";

let presentation = maximalPresentation;
let presentationChangeHandler = null;

export function getPresentation(): Presentation {
    return presentation;
}

export function setPresentation(newPresentation: Presentation): void {
    presentation = newPresentation;
}

export function dispatch(modifyFn, payload?) {
    const newPresentation = modifyFn(presentation, payload);
    setPresentation(newPresentation)
    if (presentationChangeHandler) {
        presentationChangeHandler()
    }
}

export function addPresentationChangeHandler(handler) {
    presentationChangeHandler = handler;
}