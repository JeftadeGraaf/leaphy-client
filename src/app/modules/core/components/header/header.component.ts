import { Component } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { RobotWiredState } from 'src/app/state/robot.wired.state';
import { BackEndState } from 'src/app/state/backend.state';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { WorkspaceStatus } from 'src/app/domain/workspace.status';
import { SketchStatus } from 'src/app/domain/sketch.status';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HostListener } from '@angular/core';
import { DialogState } from 'src/app/state/dialog.state';
import { Language } from 'src/app/domain/language';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    public appState: AppState,
    public robotWiredState: RobotWiredState,
    public backEndState: BackEndState,
    public blocklyState: BlocklyEditorState,
    public dialogState: DialogState,
    private logger: LogService
  ) { }

  public onNewProjectClicked() {
    this.appState.setSelectedRobotType(null);
  }

  public onLoadWorkspaceClicked() {
    this.blocklyState.setWorkspaceStatus(WorkspaceStatus.Finding);
  }

  public onSaveWorkspaceClicked() {
    this.blocklyState.setWorkspaceStatus(WorkspaceStatus.Saving);
  }

  // To capture the keyboard shortcut for Saving a project
  @HostListener('window:keydown', ['$event'])
  onCtrlS(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 's') {
      this.onSaveWorkspaceClicked();
      event.preventDefault();
    }
  }

  public onCodeEditorClicked() {
    this.appState.setIsCodeEditorToggleRequested();
  }

  public onSaveWorkspaceAsClicked() {
    this.blocklyState.setWorkspaceStatus(WorkspaceStatus.SavingAs);
  }

  public onUploadClicked() {
    this.blocklyState.setSketchStatus(SketchStatus.Sending);
  }

  public onUndoClicked() {
    this.blocklyState.setUndo(false);
  }

  public onRedoClicked() {
    this.blocklyState.setUndo(true);
  }

  public onHelpClicked() {
    this.appState.setShowHelpPage(true);
  }

  public onShowInfoClicked() {
    this.dialogState.setIsInfoDialogVisible(true);
  }

  public onViewLogClicked() {
    this.backEndState.setIsViewLogClicked();
  }

  public onToggleSoundClicked() {
    this.blocklyState.setIsSoundToggled();
  }

  public onInstallDriverClicked() {
    this.backEndState.setIsDriverInstalling(true);
  }

  public onClearLibrariesClicked() {
    this.backEndState.setIsLibrariesClearing(true);
  }

  public isBackEndBusy$: Observable<boolean> = combineLatest(
    [this.robotWiredState.isInstallationVerified$,
    this.appState.selectedRobotType$,
    this.blocklyState.sketchStatus$]
  )
    .pipe(switchMap(([isVerified, robotType, sketchStatus]) => {
      return of((!!robotType && !isVerified) || sketchStatus == SketchStatus.Sending);
    }));

  public canUpload$: Observable<boolean> = combineLatest(
    [this.robotWiredState.isInstallationVerified$, this.blocklyState.sketchStatus$]
  )
    .pipe(switchMap(([isVerified, sketchStatus]) => {
      return of(isVerified && sketchStatus < SketchStatus.Sending);
    }));


  public onLanguageChanged(language: Language) {
    this.appState.setChangedLanguage(language);
  }
}


