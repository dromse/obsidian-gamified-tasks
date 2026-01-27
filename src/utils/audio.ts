import { Vault, TFile } from "obsidian";
import { logger } from "./logger";

export const playSound = (vault: Vault, path: string, enable: boolean): void => {
    if (!enable) return

    const file = vault.getAbstractFileByPath(path);

    if (file instanceof TFile) {
        const soundPath = vault.adapter.getResourcePath(file.path);
        new Audio(soundPath).play().catch(logger);
    } else {
        logger(`File '${path}' does not exist. Cannot play the sound.`);
    }
};
