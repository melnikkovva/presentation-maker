import { Button } from "../../common/Button/Button";
import saveIcon from '../../assets/icons/save.png';

export function ExportControls() {

    function handleAction(): void {
        console.log('Сохранить');
    };

    return (
        <div>
            <Button 
                icon={saveIcon}
                onClick={handleAction}
            />
        </div>
    );
}