// import type { Presentation } from "../types/types_of_presentation.js";
// import exampleImage from '../../assets/img/example.jpg';

// export const minimalPresentation: Presentation = {
//     id: "presentation-minimal",
//     title: "Минимальная презентация",
//     slides: {
//         slides: [
//             {
//                 id: "slide-minimal",
//                 background: { type: 'color', color: "#ffffff" },
//                 slideObjects: []
//             }
//         ],
//         currentSlideId: "slide-minimal"
//     },
//     selection: null 
// };

// export const maximalPresentation: Presentation = {
//     id: "presentation-maximal",
//     title: "Максимальная презентация",
//     slides: {
//         slides: [
//             {
//                 id: "slide-1",
//                 background: { type: 'color', color: "#ffffff" },
//                 slideObjects: [
//                     {
//                         id: "text1",
//                         type: "text",
//                         x: 100,
//                         y: 50,
//                         w: 200,
//                         h: 60,
//                         text: "Привет",
//                         fontSize: 28,
//                         fontFamily: "Inter, sans-serif",
//                         fontWeight: "700",
//                         textDecoration: "none",
//                         textAlign: "center",
//                         color: "#2d3748",
//                         shadow: {
//                             x: 15,
//                             y: 15,
//                             blur: 0,
//                             color: "rgba(184, 38, 38, 0.1)"
//                         }
//                     },
//                     {
//                         id: "text2",
//                         type: "text",
//                         x: 50,
//                         y: 150,
//                         w: 700,
//                         h: 80,
//                         text: "Тут реально крутой редактор презентаций",
//                         fontSize: 18,
//                         fontFamily: "Inter, sans-serif",
//                         fontWeight: "400",
//                         textDecoration: "none",
//                         textAlign: "center",
//                         color: "#7292c8ff",
//                         shadow: null
//                     },
//                     {
//                         id: "image1",
//                         type: "image",
//                         x: 250,
//                         y: 230,
//                         w: 300,
//                         h: 300,
//                         src: exampleImage
//                     }
//                 ]
//             },
//             {
//                 id: "slide-2", 
//                 background: { type: 'color', color: "#4f99cbff" },
//                 slideObjects: [
//                     {
//                         id: "text-3",
//                         type: "text",
//                         x: 100,
//                         y: 100,
//                         w: 600,
//                         h: 400,
//                         text: "Это второй слайд",
//                         fontSize: 20,
//                         fontFamily: "Inter, sans-serif",
//                         fontWeight: "500", 
//                         textDecoration: "none",
//                         textAlign: "left",
//                         color: "#2d3748",
//                         shadow: null
//                     }
//                 ]
//             }
//         ],
//         currentSlideId: "slide-1"
//     },
//     selection: null 
// };