import { TextObject } from "../../common/Text/TextObject";
import { ImageObject } from "../../common/Image/ImageObject";
import { useDnd } from "../../hooks/useDragAndDrop";
import type { SelectionItem } from "../../store/types/types_of_presentation";

type SlideObjectProps = {
    object: any;
    slideId: string;
    isPreview: boolean;
    selectedObjectIds: string[];
    selectionObjects: SelectionItem[];
    selectedObjectsWithPositions: Array<{ id: string; x: number; y: number }>;
    onSelectionChange: (
        objectId: string,
        objectType: "text" | "image",
        addToSelection: boolean
    ) => void;
    onFinish: (finalX: number, finalY: number) => void;
    };

export function SlideObject({
    object,
    isPreview,
    selectedObjectIds,
    selectionObjects,
    onSelectionChange,
    onFinish,
}: SlideObjectProps) {
    const objectId = object.id;
    const isSelected = selectedObjectIds.includes(objectId);
    const isPrimarySelected = selectionObjects[0]?.objectId === objectId;

    const dnd = useDnd({
    startX: object.x,
    startY: object.y,
    onFinish,
    isSelected,
    objectId,
    onSelectionChange: (id: string, add: boolean) =>
        onSelectionChange(id, object.type, add), 
    });

    const objectStyle = {
        position: "absolute" as const,
        top: dnd.top,
        left: dnd.left,
    };

    if (object.type === "text") {
        return (
        <TextObject
            objectId={objectId}
            isPreview={isPreview}
            isDragging={dnd.isDragging}
            isSelected={isSelected}
            isPrimarySelected={isPrimarySelected}
            onMouseDown={dnd.onMouseDown}
            style={objectStyle}
        />
        );
    } else if (object.type === "image") {
        return (
        <ImageObject
            objectId={objectId}
            isPreview={isPreview}
            isDragging={dnd.isDragging}
            isSelected={isSelected}
            isPrimarySelected={isPrimarySelected}
            onMouseDown={dnd.onMouseDown}
            style={objectStyle}
        />
        );
    }

    return null;
}