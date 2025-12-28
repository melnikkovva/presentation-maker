import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv); 

export const presentationSchema = {
  type: 'object',
  required: ['id', 'title', 'email', 'slides'],
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    email: { type: 'string', format: 'email' },
    slides: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'background', 'elements'],
        properties: {
          id: { type: 'string' },
          background: {
            oneOf: [
              {
                type: 'object',
                required: ['type', 'color'],
                properties: {
                  type: { const: 'color' },
                  color: { type: 'string' },
                },
                additionalProperties: false,
              },
              {
                type: 'object',
                required: ['type', 'src'],
                properties: {
                  type: { const: 'image' },
                  src: { type: 'string' },
                },
                additionalProperties: false,
              },
            ],
          },
          elements: {
            type: 'array',
            items: {
              oneOf: [
                {
                  type: 'object',
                  required: [
                    'id', 'type', 'x', 'y', 'w', 'h', 'text',
                    'fontSize', 'fontFamily', 'fontWeight',
                    'textDecoration', 'textAlign', 'color', 'shadow'
                  ],
                  properties: {
                    id: { type: 'string' },
                    type: { const: 'text' },
                    x: { type: 'number' },
                    y: { type: 'number' },
                    w: { type: 'number' },
                    h: { type: 'number' },
                    text: { type: 'string' },
                    fontSize: { type: 'number' },
                    fontFamily: { type: 'string' },
                    fontWeight: { type: 'string' },
                    textDecoration: { enum: ['underline', 'line-through', 'none'] },
                    textAlign: { enum: ['left', 'center', 'right', 'justify'] },
                    color: { type: 'string' },
                    shadow: {
                      oneOf: [
                        {
                          type: 'object',
                          required: ['x', 'y', 'blur', 'color'],
                          properties: {
                            x: { type: 'number' },
                            y: { type: 'number' },
                            blur: { type: 'number' },
                            color: { type: 'string' },
                          },
                          additionalProperties: false,
                        },
                        { type: 'null' },
                      ],
                    },
                  },
                  additionalProperties: false,
                },
                {
                  type: 'object',
                  required: ['id', 'type', 'x', 'y', 'w', 'h', 'src'],
                  properties: {
                    id: { type: 'string' },
                    type: { const: 'image' },
                    x: { type: 'number' },
                    y: { type: 'number' },
                    w: { type: 'number' },
                    h: { type: 'number' },
                    src: { type: 'string' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
} as const;

export const validatePresentation = ajv.compile(presentationSchema);