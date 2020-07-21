import { useRef } from 'react';
import axios from 'axios';
import { setHasOrganization } from '../../utils/user';
import { errorToast } from '../../utils/toast';
import { useHistory } from 'react-router';
import { useToast } from '@chakra-ui/core';
import callbackIfExists from '../../utils/callback-if-exists';

const useChatTarget = () => {
  const history = useHistory();
  const toast = useToast();

  const listeners = useRef({
    groups: [],
    activeGroup: [],
    organizations: [],
    activeOrganization: [],
    activeMessages: [],
  });

  const commitChanges = (changes = {}) => {
    chatRef.current = {
      ...chatRef.current,
      ...changes,
    };
    Object.keys(changes).forEach((field) => {
      // eslint-disable-next-line no-unused-expressions
      listeners.current[field]?.forEach((callback) => {
        callback();
      });
    });
  };

  const addListener = (fields, callback) => {
    fields.forEach((field) => {
      listeners.current[field].push(callback);
    });
  };

  const removeListener = (fields, callback) => {
    fields.forEach((field) => {
      listeners.current[field] = listeners.current[field].filter((c) => c !== callback);
    });
  };

  const refreshGroups = (onComplete) => {
    axios
      .get('/channels')
      .then((response) => {
        const groups = response.data.data;
        // set active group
        const activeGroupID = chatRef.current.activeGroup?.id;
        if (!activeGroupID && groups.length > 0) {
          switchGroup(null, groups);
        } else if (
          !!activeGroupID &&
          (groups.length === 0 || !groups.find((g) => g.id === activeGroupID))
        ) {
          switchGroup(null, groups);
        } else {
          commitChanges({
            groups: groups,
          });
        }
        callbackIfExists(onComplete);
      })
      .catch(() => {
        errorToast('Failed to get groups.', toast);
      });
  };

  const switchGroup = (newGroup, groups = []) => {
    groups = groups.length > 0 ? groups : chatRef.current.groups;
    const setActiveGroup = (group) => {
      commitChanges({
        groups: groups,
        activeGroup: group ?? {},
        activeMessages: chatRef.current.allMessages[group?.id] ?? [],
      });
    };
    if (!newGroup && groups.length > 0) {
      setActiveGroup(groups[0]);
    } else if (!newGroup) {
      setActiveGroup({});
    } else {
      setActiveGroup(newGroup);
    }
  };

  const leaveGroup = (groupID) => {
    commitChanges({
      groups: chatRef.current.groups.filter((g) => g.id !== groupID),
    });
  };

  const newMessage = (messageBody) => {
    // find group and format message
    const group = chatRef.current.groups.find((g) => g.id === messageBody.group_id);
    const message = {
      message: messageBody.message,
      sender: group.users.find((u) => u.id === messageBody.user_id).username,
    };
    // update messages
    if (chatRef.current.allMessages[group.id]) {
      chatRef.current.allMessages[group.id].push(message);
    } else {
      chatRef.current.allMessages[group.id] = [message];
    }
    // update active messages if it exists
    if (chatRef.current.activeGroup.id === messageBody.group_id) {
      commitChanges({
        activeMessages: chatRef.current.allMessages[group.id],
      });
    }
  };

  const refreshOrganizations = (onComplete) => {
    axios
      .get('/organizations')
      .then((response) => {
        const organizations = response.data.data;
        if (organizations.length > 0) {
          commitChanges({
            organizations: organizations,
            activeOrganization: organizations[0],
          });
          callbackIfExists(onComplete);
        } else {
          setHasOrganization(false);
          history.push('/organization');
        }
      })
      .catch(() => {
        errorToast('Failed to get organizations.', toast);
      });
  };

  const chatRef = useRef({
    groups: [],
    activeGroup: {},
    organizations: [],
    activeOrganization: {},
    allMessages: {},
    activeMessages: [],
    refreshGroups: refreshGroups,
    switchGroup: switchGroup,
    leaveGroup: leaveGroup,
    refreshOrganizations: refreshOrganizations,
    newMessage: newMessage,
    addListener: addListener,
    removeListener: removeListener,
  });

  return chatRef;
};

export default useChatTarget;
