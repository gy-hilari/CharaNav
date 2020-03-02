import React from 'react';
import Aux from '../../hoc/Auxi';
import './characterForm.css';

const characterForm = (props) => {
    return props.formMode === 'char' ? (
        <Aux>
            <h2>New Character:</h2>
            <input id="newChar-name" type="text" placeholder="Character Name" />
            <h4 className="button confirm" onClick={() => {
                props.newChar({
                    compId: props.compId,
                    name: document.getElementById('newChar-name').value
                });
                if (
                    props.compId &&
                    document.getElementById('newChar-name').value
                ) props.setFormMode(null);
            }}>
                Create Character
                </h4>
            <h4 className="button cancel" onClick={() => {
                props.setFormMode(null);
            }}>
                Cancel
            </h4>
        </Aux>
    ) : null;
};

export default characterForm;