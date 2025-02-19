"use client";

import { CreateServerModal } from "../modals/create-server-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { InviteModal } from "../server/invite-modal";


export const ModalProvider = () => {

    return (
        <>
            <CreateServerModal/>
            <InviteModal/>
            <EditServerModal/>
      
            <LeaveServerModal/>
        </>
    );
};
