"use client";

import { CreateChannelModal } from "../modals/create-channel-modal";
import { CreateServerModal } from "../modals/create-server-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";
import { DeleteMessageModal } from "../modals/delete-message-modal";
import { DeleteServerModal } from "../modals/delete-server-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { MembersModal } from "../modals/members-modal";
import MessageFileModal from "../modals/message-file-modal";
import { InviteModal } from "../server/invite-modal";


export const ModalProvider = () => {

    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal/>
            <EditChannelModal />
            <DeleteChannelModal />
            <DeleteServerModal />
            <LeaveServerModal />
            <MessageFileModal />
            <DeleteMessageModal />
        </>
    );
};
