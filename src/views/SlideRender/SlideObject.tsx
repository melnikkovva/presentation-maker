import { TextObject } from "../../common/Text/TextObject";
import { ImageObject } from "../../common/Image/ImageObject";
import { useDnd } from "../../hooks/useDragAndDrop";
import type { SelectionItem } from "../../store/types/types_of_presentation";
import { PLAYER_RATIO, PREVIEW_SCALE } from "../../store/data/const_for_presantation";

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

    let scale = isPreview ? PREVIEW_SCALE : 1;
    if (isPlayer) {
    scale = PLAYER_RATIO;
    }

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