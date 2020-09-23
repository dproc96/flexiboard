import styled from 'styled-components'

const StyledButton = styled.button`
    background-color: ${props => props.theme.primaryDark};
    border: none;
    color: ${props => props.theme.white};
    border-radius: 10px;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
    padding: 10px;
    display: block;
    margin: 5px 0px;

    :hover {
        cursor: pointer;
        background-color: ${props => props.theme.primaryDarker};
    }

    :focus {
        outline: none;
    }
    
    :active {
        transform: scale(0.9, 0.9);
    }
`

export default StyledButton