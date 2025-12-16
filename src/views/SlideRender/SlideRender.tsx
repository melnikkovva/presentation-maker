import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectSlideById, selectObjectsBySlideId, selectSelectedObjects } from "../../store/selectors/presentationSelectors";
import { setSelection, addToSelection, removeFromSelection } from "../../store/slices/selectionSlice";
import { updateObjectPosition, updateObjectsPositions } from "../../store/slices/objectsSlice";
import type { SelectionItem } from "../../store/types/types_of_presentation";
import { SlideObject } from "./SlideObject";
import { useMemo } from "react";

type SlideRenderProps = {
  slideId: string | null;
  isPreview?: boolean;
};

export function SlideRender({ slideId, isPreview = false }: SlideRenderProps) {
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
      const isDraggedSelected = selectedObjectIds.includes(draggedObjectId);
      const hasMultiple = selectedObjectIds.length > 1;

      if (isDraggedSelected && hasMultiple) {
        const draggedObj = objects.find((o) => o.id === draggedObjectId);
        if (!draggedObj) return;

        const deltaX = finalX - draggedObj.x;
        const deltaY = finalY - draggedObj.y;

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
            x: finalX,
            y: finalY,
          })
        );
      }
    };
  }, [selectedObjectIds, objects, dispatch]);

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
        backgroundImage: `url(${slideBackground.src})`,
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
    pointerEvents: isPreview ? "none" : "auto",
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