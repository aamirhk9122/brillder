// @ts-ignore
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
// @ts-ignore
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// @ts-ignore
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
// @ts-ignore
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import ReactDOM from 'react-dom';
import CommentButton from '../comments/CommentButton';
import React from 'react';

class CommentCustom extends Plugin {

    static get requires() {
        return [ Widget ];
    }

    editor: any = null;

    constructor(editor: any) {
        super(editor);
        this.editor = editor;
    }

    init() {
        const editor = this.editor;
        this.defineSchema();
        this.defineConverters();

        editor.ui.componentFactory.add('addComment', (locale: any) => {
            const view = new ButtonView(locale);

            view.set({
                label: "Add Comment",
                withText: true,
                tooltip: true
            });

            view.on('execute', () => {
                editor.model.change((writer: any) => {
                    const commentElement = writer.createElement('comment', {
                        id: 1,
                        text: "This is a comment."
                    });

                    editor.model.insertContent(commentElement);
                });
            });

            return view;
        });
    }

    defineSchema() {
        const schema = this.editor.model.schema;
        schema.register('comment', {
            allowWhere: "$text",
            isInline: true,
            isObject: true,
            allowAttributes: ['text']
        });
    }

    defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: ['comment-button']
            },
            model: (viewElement: any, modelWriter: any) => {
                const text = viewElement.getChild(0).data;

                return modelWriter.createElement('comment', {
                    id: parseInt(viewElement.getAttribute('data-id')),
                    text: "This is a comment!"
                });
            }
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'comment',
            view: (modelItem: any, viewWriter: any) => {
                const id: number = modelItem.getAttribute('id');
                const text: string = modelItem.getAttribute('text');

                const reactWrapper = viewWriter.createUIElement('div', {
                    class: 'comment__react-wrapper'
                }, function (domDocument: any) {
                    // @ts-ignore
                    const domElement = this.toDomElement(domDocument);

                    ReactDOM.render(
                        <CommentButton commentId={id} text={text} />,
                        domElement
                    );

                    return domElement;
                })

                return toWidget(reactWrapper, viewWriter);
            }
        });

        conversion.for( 'dataDowncast' ).elementToElement({
            model: 'comment',
            view: (modelItem: any, viewWriter: any) => {
                const element = viewWriter.createContainerElement('div');
                return element;
            }
        });
    }

}

export default CommentCustom;