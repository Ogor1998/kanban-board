import * as React from 'react';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DateSelector({ dateValue, setDateValue }) {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker value={dateValue} onChange={(newValue) => {
                    console.log("DatePicker picked value:", newValue);
                    setDateValue(newValue);
                }} />
            </DemoContainer>
        </LocalizationProvider>
    );
}