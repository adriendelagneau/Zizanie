"use client";

import { CreateChannelModal } from "../modals/create-channel-modal";
import { CreateServerModal } from "../modals/create-server-modal";
import { DeleteServerModal } from "../modals/delete-server-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { MembersModal } from "../modals/members-modal";
import { InviteModal } from "../server/invite-modal";


export const ModalProvider = () => {

    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal/>
            <DeleteServerModal />
            <LeaveServerModal />
        </>
    );
};
