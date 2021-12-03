import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BlocklyEditorState } from "src/app/state/blockly-editor.state";
import { AppState } from "src/app/state/app.state";
import { DialogState } from "src/app/state/dialog.state";
import { CodeEditorType } from "src/app/domain/code-editor.type";
import { RobotWiredState } from "src/app/state/robot.wired.state";

@Component({
  selector: "app-button-bar",
  templateUrl: "./button-bar.component.html",
  styleUrls: ["./button-bar.component.scss"],
})
export class ButtonBarComponent {
  constructor(
    public appState: AppState,
    public blocklyState: BlocklyEditorState,
    public dialogState: DialogState,
    public robotWiredState: RobotWiredState,
    public dialog: MatDialog
  ) {
  }
  public onBlocklyEditorClicked() {
        this.appState.setCodeEditor(CodeEditorType.Beginner);
  }

  public onCodeEditorClicked() {
        this.appState.setIsCodeEditorToggled(true);
  }

  public onShowSerialOutputClicked() {
    this.dialogState.setIsSerialOutputFocus(true);
  }
}


