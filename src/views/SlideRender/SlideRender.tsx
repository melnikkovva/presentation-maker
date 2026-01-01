import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectSlideById, selectObjectsBySlideId, selectSelectedObjects } from "../../store/selectors/presentationSelectors";
import { setSelection, addToSelection, removeFromSelection } from "../../store/slices/selectionSlice";
import { updateObjectPosition, updateObjectsPositions } from "../../store/slices/objectsSlice";
import type { SelectionItem } from "../../store/types/types_of_presentation";
import { SlideObject } from "./SlideObject";
import { PLAYER_RATIO, PREVIEW_SCALE } from "../../store/data/const_for_presantation";
import { useMemo } from "react";
import { getImageUrl } from "../../store/functions/functions_for_DB";

type SlideRenderProps = {
  slideId: string | null;
  isPreview?: boolean;
  isPlayer?: boolean;
};

export function SlideRender({ slideId, isPreview = false, isPlayer = false }: SlideRenderProps) {
  const dispatch = useAppDispatch();
  const slide = useAppSelector(
    slideId ? selectSlideById(slideId) : () => null
  );
  const objects = useAppSelector(selectObjectsBySlideId(slideId || ""));
  const selectionObjects = useAppSelector(selectSelectedObjects);

  const selectedObjectIds = useMemo(
    () => selectionObjects.map((obj: SelectionItem) => obj.objectId),
    [selectionObjects]
  );

  const selectedObjectsWithPositions = useMemo(() => {
    return objects
      .filter((obj) => selectedObjectIds.includes(obj.id))
      .map((obj) => ({ id: obj.id, x: obj.x, y: obj.y }));
  }, [objects, selectedObjectIds]);

  let scale = isPreview ? PREVIEW_SCALE : 1;
  if (isPlayer) {
  scale = PLAYER_RATIO;
  }

  const handleSelectionChange = (
    objectId: string,
    objectType: "text" | "image",
    addedToSelection: boolean
  ) => {
    if (addedToSelection) {
      if (selectedObjectIds.includes(objectId)) {
        dispatch(removeFromSelection(objectId));
      } else {
        const selectionItem: SelectionItem = {
          slideId: slideId || "",
          objectId,
          typeElement: objectType,
        };
        dispatch(addToSelection(selectionItem));
      }
    } else {
      const selectionItem: SelectionItem = {
        slideId: slideId || "",
        objectId,
        typeElement: objectType,
      };
      dispatch(setSelection([selectionItem]));
    }
  };

  const handleObjectFinish = useMemo(() => {
    return (draggedObjectId: string) => (finalX: number, finalY: number) => {
      const logicalX = finalX / scale;
      const logicalY = finalY / scale;

      const isDraggedSelected = selectedObjectIds.includes(draggedObjectId);
      const hasMultiple = selectedObjectIds.length > 1;

      if (isDraggedSelected && hasMultiple) {
        const draggedObj = objects.find((o) => o.id === draggedObjectId);
        if (!draggedObj) return;

        const deltaX = logicalX - draggedObj.x;
        const deltaY = logicalY - draggedObj.y;

        const updates = selectedObjectIds.map((id) => {
          const obj = objects.find((o) => o.id === id)!;
          return {
            objectId: id,
            x: obj.x + deltaX, 
            y: obj.y + deltaY,
          };
        });

        dispatch(updateObjectsPositions(updates));
      } else {
        dispatch(
          updateObjectPosition({
            objectId: draggedObjectId,
            x: logicalX, 
            y: logicalY,
          })
        );
      }
    };
  }, [selectedObjectIds, objects, dispatch, scale]);

  const handleSlideClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      dispatch(setSelection([]));
    }
  };

  if (!slide) return null;

  function getSlideBackgroundStyle(slideBackground: any): React.CSSProperties {
  if (slideBackground.type === "color") {
    return { backgroundColor: slideBackground.color };
  } else {
    return {
      backgroundImage: `url(${getImageUrl(slideBackground.src)})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
}

  const style: React.CSSProperties = {
    ...getSlideBackgroundStyle(slide.background),
    position: "relative",
    width: "100%",
    height: "100%",
    pointerEvents: (isPreview || isPlayer) ? "none" : "auto",
  };

  return (
    <div style={style} onClick={handleSlideClick}>
      {objects.length > 0 ? (
        objects.map((object) => (
          <SlideObject
            key={object.id}
            object={object}
            slideId={slideId || ""}
            isPreview={isPreview}
            isPlayer={isPlayer}
            selectedObjectIds={selectedObjectIds}
            selectionObjects={selectionObjects}
            selectedObjectsWithPositions={selectedObjectsWithPositions}
            onSelectionChange={handleSelectionChange}
            onFinish={handleObjectFinish(object.id)}
          />
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
}