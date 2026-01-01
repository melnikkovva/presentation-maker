import { TextObject } from "../../common/Text/TextObject";
import { ImageObject } from "../../common/Image/ImageObject";
import { useDnd } from "../../hooks/useDragAndDrop";
import type { SelectionItem } from "../../store/types/types_of_presentation";

type SlideObjectProps = {
    object: any;
    slideId: string;
    isPreview: boolean;
    isPlayer: boolean;
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
    isPlayer,
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

    const isInteractive = !(isPreview || isPlayer);

    const objectStyle = isInteractive && dnd.isDragging
    ? {
        position: "absolute" as const,
        top: dnd.top,
        left: dnd.left,
        }
    : undefined;

    if (object.type === "text") {
        return (
        <TextObject
            objectId={objectId}
            isPreview={isPreview}
            isPlayer={isPlayer}
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
            isPlayer={isPlayer}
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