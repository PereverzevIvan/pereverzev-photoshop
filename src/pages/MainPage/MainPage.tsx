import { ActionsMenu } from "../../modules/ActionsMenu/ActionsMenu";
import { CanvasModule } from "../../modules/Canvas/Canvas";
import { ColorInfoPanel } from "../../modules/ColorPickerWindow/ColorPickerWindow";
import { InstrumentsPanel } from "../../modules/InstrumentsPanel/InstrumentsPanel";
import { RightPanel } from "../../modules/RightPanel/RightPanel";
import { StatusBar } from "../../modules/StatusBar/StatusBar";
import s from "./MainPage.module.scss";

export function MainPage() {
  return (
    <>
      <ActionsMenu />
      <div className={s.mainArea}>
        <InstrumentsPanel />
        <CanvasModule />
        <RightPanel />
      </div>
      <StatusBar />
      <ColorInfoPanel />
    </>
  );
}
