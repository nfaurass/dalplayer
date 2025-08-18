import {DALPlayer} from "./DALPlayer";

export interface DALPlayerPlugin {
    name: string;

    setup(player: DALPlayer): void;

    destroy?(): void;
}