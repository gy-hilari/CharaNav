import React from 'react';
import Aux from '../../hoc/Auxi';

const characterForm = (props) => {
    return props.formMode === 'char' ? (
        <Aux>
            <h2>New Character:</h2>
            <input id="newChar-name" type="text" placeholder="name" />
            <button onClick={() => {
                props.newChar({
                    compId: props.compId,
                    name: document.getElementById('newChar-name').value
                });
            }}>
                Create Character
                </button>
            <button onClick={() => {
                props.setFormMode(null);
            }}>
                Cancel
            </button>

            <hr />
        </Aux>
    ) : null;
};

export default characterForm;