import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { FcRefresh } from "react-icons/fc";
import { useAppDispatch } from "store/hooks";
import { openToast } from 'store/ui/slice';
import Tooltip from './Tooltip';
import { setSearchQuery, emptySearchQuery} from 'store/ui/slice';

export default function InputfieldABBY({ displayText }: any) {
    const dispatch = useAppDispatch();
    const [userquery, setUserquery] = React.useState('');
    const displayTextValue = displayText ? displayText : 'Search Ava ...';

    const handleSubmitSearch = (e: any) => {
        e.preventDefault();
        if(!userquery) {
            dispatch(openToast({open: true, message: "Your query is empty!", severity: "error"}))
        }
        
        // handleResetInput();
        dispatch(setSearchQuery(userquery));
    }

    const keypress = (e: any) => {
        if(e.key === 'Enter') {
            
            handleSubmitSearch(e);
        } 
    }

    const handleResetInput = () => {
        dispatch(emptySearchQuery());
        setUserquery('');
    }

     
    const handlePaste = (e: any) => {
        e.preventDefault();
        dispatch(emptySearchQuery());
        const pastedText = e.clipboardData.getData('text');
        setUserquery(pastedText);
    }




    return (
        <Paper
            component="form"
            elevation={2}
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '60%', borderRadius: "25px", zIndex: 1, backgroundColor: "grey" }}
            >
            <Tooltip title="Reset" placement="top"> 
                <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={handleResetInput}>
                    <FcRefresh />
                </IconButton>
            </Tooltip>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={displayTextValue}
                value={userquery}
                inputProps={{ 'aria-label': displayTextValue }}
                onChange={(e) => {
                    setUserquery(e.currentTarget.value);	
                    
                    // if (e.currentTarget.value.length === 1) {
                    //     handleResetInput();
                    // }

                    }}
                onKeyDown={keypress}
                onPaste={handlePaste}
            />
            <Tooltip title="Suche" placement="top">
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSubmitSearch}>
                    <SearchIcon sx={{ width: 26, height: 26, color: "blue" }} />
                </IconButton>
            </Tooltip>
        </Paper>
    );
}