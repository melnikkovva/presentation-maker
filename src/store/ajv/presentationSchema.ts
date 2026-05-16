import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { 
  Presentation, 
  Background, 
  TextObject, 
  ImageObject, 
} from '../types/types_of_presentation';
import type { JSONContent } from '@tiptap/react';
import { getPresentationDB } from '../functions/functions_for_DB';

const ajv = new Ajv({ 
  strict: false, 
  allErrors: true,
  useDefaults: true,
  coerceTypes: true
});
addFormats(ajv);

const jsonContentSchema: any = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    content: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true
      }
    },
    attrs: { type: 'object' },
    marks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          attrs: { type: 'object' }
        },
        required: ['type']
      }
    },
    text: { type: 'string' }
  },
  required: ['type'],
  additionalProperties: true
};

const textShadowSchema = {
  type: 'object',
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    blur: { type: 'number' },
    color: { 
      type: 'string', 
      pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgba?\\(.*\\)$' 
    }
  },
  required: ['x', 'y', 'blur', 'color'],
  additionalProperties: false
};

const backgroundSchema = {
  oneOf: [
    {
      type: 'object',
      properties: {
        type: { const: 'color' },
        color: { 
          type: 'string', 
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgba?\\(.*\\)$' 
        }
      },
      required: ['type', 'color'],
      additionalProperties: false
    },
    {
      type: 'object',
      properties: {
        type: { const: 'image' },
        src: { type: 'string' }
      },
      required: ['type', 'src'],
      additionalProperties: false
    }
  ]
};

const textElementSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { const: 'text' },
    x: { type: 'number', minimum: 0 },
    y: { type: 'number', minimum: 0 },
    w: { type: 'number', minimum: 1 },
    h: { type: 'number', minimum: 1 },
    content: jsonContentSchema,
    fontSize: { type: 'number', minimum: 1, default: 16 },
    fontFamily: { type: 'string', default: 'Arial' },
    fontStyle: { enum: ['normal', 'italic'], default: 'normal' },
    fontWeight: { 
      enum: [
        'normal', 'bold', 'lighter', 'bolder', 
        '100', '200', '300', '400', '500', '600', '700', '800', '900'
      ], 
      default: 'normal' 
    },
    textDecoration: { 
      enum: ['none', 'underline', 'line-through'], 
      default: 'none' 
    },
    textAlign: { 
      enum: ['left', 'center', 'right'], 
      default: 'left' 
    },
    color: { 
      type: 'string', 
      pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgba?\\(.*\\)$',
      default: '#000000'
    },
    shadow: {
      oneOf: [
        textShadowSchema,
        { type: 'null' }
      ],
      default: null
    },
    slideId: { type: 'string' }
  },
  required: [
    'id', 'type', 'x', 'y', 'w', 'h', 
    'content', 'textAlign', 'slideId'
  ],
  additionalProperties: false
};

const imageElementSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { const: 'image' },
    x: { type: 'number', minimum: 0 },
    y: { type: 'number', minimum: 0 },
    w: { type: 'number', minimum: 1 },
    h: { type: 'number', minimum: 1 },
    src: { type: 'string' },
    slideId: { type: 'string' }
  },
  required: ['id', 'type', 'x', 'y', 'w', 'h', 'src', 'slideId'],
  additionalProperties: false
};

const slideSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    background: backgroundSchema,
    elements: {
      type: 'array',
      items: {
        oneOf: [textElementSchema, imageElementSchema]
      }
    }
  },
  required: ['id', 'background'],
  additionalProperties: false
};

export const presentationSchema = {
  type: 'object',
  properties: {
    id: { 
      type: 'string',
      pattern: '^[a-zA-Z0-9_-]+$'
    },
    title: { 
      type: 'string',
      minLength: 1,
      maxLength: 200,
      default: 'Без названия'
    },
    email: { 
      type: 'string', 
      format: 'email',
      maxLength: 100
    },
    slides: {
      type: 'array',
      items: slideSchema,
      minItems: 1,
      maxItems: 100
    },
    createdAt: {
      type: 'string',
      format: 'date-time'
    },
    updatedAt: {
      type: 'string',
      format: 'date-time'
    },
    version: {
      type: 'string',
      pattern: '^\\d+\\.\\d+\\.\\d+$'
    }
  },
  required: ['id', 'title', 'email', 'slides'],
  additionalProperties: false
} as const;

export const validatePresentation = ajv.compile(presentationSchema);
export const validateSlide = ajv.compile(slideSchema);
export const validateTextElement = ajv.compile(textElementSchema);
export const validateImageElement = ajv.compile(imageElementSchema);
export const validateBackground = ajv.compile(backgroundSchema);

export const createEmptyTextContent = (): JSONContent => {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Текст'
          }
        ]
      }
    ]
  };
};

export const createDefaultTextElement = (id: string, slideId: string): Partial<TextObject> => {
  return {
    id,
    type: 'text' as const,
    x: 50,
    y: 50,
    w: 200,
    h: 100,
    content: createEmptyTextContent(),
    fontSize: 16,
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    color: '#000000',
    shadow: null,
    slideId
  };
};

export const createDefaultImageElement = (id: string, slideId: string): Partial<ImageObject> => {
  return {
    id,
    type: 'image' as const,
    x: 50,
    y: 50,
    w: 200,
    h: 200,
    src: '',
    slideId
  };
};

export const migrateOldPresentation = (oldData: any): Presentation => {
  const migrated: any = {
    id: oldData.id || generateId(),
    title: oldData.title || 'Без названия',
    email: oldData.email || 'unknown@example.com',
    slides: []
  };

  if (oldData.slides && Array.isArray(oldData.slides)) {
    migrated.slides = oldData.slides.map((slide: any) => {
      const newSlide: any = {
        id: slide.id || generateId(),
        background: slide.background || { type: 'color', color: '#FFFFFF' },
        elements: []
      };

      if (slide.elements && Array.isArray(slide.elements)) {
        newSlide.elements = slide.elements.map((element: any) => {
          if (element.type === 'text') {
            return migrateOldTextElement(element, newSlide.id);
          } else if (element.type === 'image') {
            return migrateOldImageElement(element, newSlide.id);
          }
          return element;
        });
      }

      return newSlide;
    });
  }

  return migrated;
};

const migrateOldTextElement = (oldElement: any, slideId: string): Partial<TextObject> => {
  const element: any = {
    id: oldElement.id || generateId(),
    type: 'text',
    x: oldElement.x || 0,
    y: oldElement.y || 0,
    w: oldElement.w || 100,
    h: oldElement.h || 50,
    slideId,
    textAlign: oldElement.textAlign || 'left',
    color: oldElement.color || '#000000',
    fontSize: oldElement.fontSize || 16,
    fontFamily: oldElement.fontFamily || 'Arial',
    fontWeight: oldElement.fontWeight || 'normal',
    textDecoration: oldElement.textDecoration || 'none',
    shadow: oldElement.shadow || null
  };

  if (oldElement.text && !oldElement.content) {
    element.content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: {
            textAlign: element.textAlign
          },
          content: [
            {
              type: 'text',
              text: oldElement.text,
              marks: [
                ...(element.color ? [{ type: 'textStyle', attrs: { color: element.color } }] : []),
                ...(element.fontWeight === 'bold' ? [{ type: 'bold' }] : []),
                ...(element.textDecoration === 'italic' ? [{ type: 'italic' }] : []),
                ...(element.textDecoration === 'underline' ? [{ type: 'underline' }] : []),
                ...(element.textDecoration === 'line-through' ? [{ type: 'strike' }] : [])
              ]
            }
          ]
        }
      ]
    };
  } else {
    element.content = oldElement.content || createEmptyTextContent();
  }

  return element;
};

const migrateOldImageElement = (oldElement: any, slideId: string): Partial<ImageObject> => {
  return {
    id: oldElement.id || generateId(),
    type: 'image',
    x: oldElement.x || 0,
    y: oldElement.y || 0,
    w: oldElement.w || 100,
    h: oldElement.h || 100,
    src: oldElement.src || '',
    slideId
  };
};

export const normalizeAndValidatePresentation = (data: any): {
  presentation: Presentation;
  isValid: boolean;
  errors?: any[];
} => {
  const errors: any[] = [];
  
  const migratedData = migrateOldPresentation(data);
  
  const isValid = validatePresentation(migratedData);
  
  if (!isValid) {
    errors.push(...(validatePresentation.errors || []));
  }
  
  const sanitized = sanitizePresentation(migratedData);
  
  return {
    presentation: sanitized as Presentation,
    isValid,
    errors: errors.length > 0 ? errors : undefined
  };
};

export const sanitizePresentation = (data: any): any => {
  return {
    id: String(data.id || generateId()),
    title: String(data.title || 'Без названия').trim(),
    email: String(data.email || '').toLowerCase().trim(),
    slides: Array.isArray(data.slides) 
      ? data.slides.map((slide: any) => sanitizeSlide(slide))
      : [{ 
          id: generateId(), 
          background: { type: 'color', color: '#FFFFFF' },
          elements: [] 
        }],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0.0'
  };
};

const sanitizeSlide = (slide: any) => {
  return {
    id: String(slide.id || generateId()),
    background: sanitizeBackground(slide.background),
    elements: Array.isArray(slide.elements) 
      ? slide.elements.map((element: any) => sanitizeElement(element, slide.id))
      : []
  };
};

const sanitizeBackground = (background: any): Background => {
  if (!background || !background.type) {
    return { type: 'color', color: '#FFFFFF' };
  }
  
  if (background.type === 'color') {
    return {
      type: 'color',
      color: String(background.color || '#FFFFFF')
    };
  } else {
    return {
      type: 'image',
      src: String(background.src || '')
    };
  }
};

const sanitizeElement = (element: any, slideId: string) => {
  const base = {
    id: String(element.id || generateId()),
    x: Math.max(0, Number(element.x) || 0),
    y: Math.max(0, Number(element.y) || 0),
    w: Math.max(1, Number(element.w) || 100),
    h: Math.max(1, Number(element.h) || 100),
    slideId
  };

  if (element.type === 'text') {
    return {
      ...base,
      type: 'text',
      slideId,
      content: element.content || createEmptyTextContent(),
      fontSize: Math.max(1, Number(element.fontSize) || 16),
      fontFamily: String(element.fontFamily || 'Arial'),
      fontStyle: ['normal', 'italic'].includes(element.fontStyle) 
        ? element.fontStyle 
        : 'normal',
      fontWeight: [
        'normal', 'bold', 'lighter', 'bolder', 
        '100', '200', '300', '400', '500', '600', '700', '800', '900'
      ].includes(element.fontWeight) 
        ? element.fontWeight 
        : 'normal',
      textDecoration: ['none', 'underline', 'line-through'].includes(element.textDecoration)
        ? element.textDecoration
        : 'none',
      textAlign: ['left', 'center', 'right'].includes(element.textAlign)
        ? element.textAlign
        : 'left',
      color: String(element.color || '#000000'),
      shadow: element.shadow || null
    };
  } else {
    return {
      ...base,
      type: 'image',
      slideId,
      src: String(element.src || '')
    };
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const loadAndValidatePresentation = async (presentationId: string): Promise<Presentation> => {
  try {
    const rawData = await getPresentationDB(presentationId);
    
    const { presentation, isValid, errors } = normalizeAndValidatePresentation(rawData);
    
    if (!isValid) {
      console.warn('Валидационные ошибки:', errors);
    }
    
    return presentation;
  } catch (error) {
    console.error('Ошибка загрузки презентации:', error);
    throw error;
  }
};
