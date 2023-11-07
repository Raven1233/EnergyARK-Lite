import {React, useState, useRef, useEffect} from 'react'
import { PlusIcon, InboxArrowDownIcon} from '@heroicons/react/24/solid'
import { InformationCircleIcon} from '@heroicons/react/24/outline'
import { Slider, SliderThumb, SliderValueLabelProps, Box, TextField } from '@mui/material';
import { rgbToHex, styled } from '@mui/material/styles'
import { createTheme,ThemeProvider } from '@mui/material/styles';
import ReactSpeedometer from "react-d3-speedometer"
import { purple } from '@mui/material/colors';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAxios } from './useAxios';
import { render } from '@testing-library/react';
import html2canvas from 'html2canvas';
/* const res = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        'construction_year': jahr,
        'building_type': gType
      })
    }).then(response => response.json())
    .then(responseJson => {
      return JSON.stringify(responseJson.data);
    })
    .catch(error => {
      console.log(error);
    })*/ 
function MainView() {

  const [fassade, setFassade] = useState(0); // State of Fassade value
  const [fenster, setFenster] = useState(0); // State of Fenster value
  const [dach, setDach] = useState(0); // State of Dach value
  const [keller, setKeller] = useState(0); // State of Keller value
  const [lüftung, setLüftung] = useState(0); // State of Lüftung value
  const [gesamt, setGesamt] = useState(0); // State of Gesamt value
  const [data, setData] = useState(null); // Fetching data from API
  const [error, setError] = useState(null); // Error handling
  const [jahr, setJahr] = useState(''); // Baujahr
  const [gType, setGType] = useState(''); // Gebäudetyp
  const [wGesamt, setWgesamt] = useState(''); // Wohnfläche gesamt
  const [loading, setLoading] = useState(false); // Loading state
  const [energy, setEnergy] = useState(0); // Endenergieverbrauche
  const [fassadeDesc, setFassadeDesc] = useState(''); // Fassade description
  const [fensterDesc, setFensterDesc] = useState(''); // Fenster description
  const [dachDesc, setDachDesc] = useState(''); // Dach description
  const [kellerDesc, setKellerDesc] = useState(''); // Keller description
  const [lüftungDesc, setLüftungDesc] = useState(''); // Lüftung description
  

  useEffect(() => {
    if(data!==null){
      const {references, status, statistical_consumption_data} = data;
      const {gross_energy_roomheating_values, gross_energy_waterheating_values} = statistical_consumption_data;
      const {cellarroof, hull, roof, windows, ventilation} = references;
      const fassade_value = destructuringDesc(hull, fassade);
      setFassadeDesc(fassade_value);
      const dach_value = destructuringDesc(roof, dach);
      setDachDesc(dach_value);
      const fenster_value = destructuringDesc(windows, fenster);
      setFensterDesc(fenster_value);
      const keller_value = destructuringDesc(cellarroof, keller);
      setKellerDesc(keller_value);
      const lüftung_value = destructuringDesc(ventilation, lüftung);
      setLüftungDesc(lüftung_value);
      const cell_roof_value = destructuring(cellarroof, keller);
      const hull_value = destructuring(hull, fassade);
      const roof_value = destructuring(roof, dach);
      const windows_value = destructuring(windows, fenster);
      const ventilation_value = destructuring(ventilation, lüftung);
      const total = cell_roof_value + hull_value + roof_value + windows_value + ventilation_value;
      const roomheating = linearInterpolation(total, 0, 75, gross_energy_roomheating_values);
      const waterheating = linearInterpolation(total, 0, 75, gross_energy_waterheating_values);
      const Endenergieverbrauche = roomheating + waterheating;
      setEnergy(Math.round((Endenergieverbrauche + Number.EPSILON) * 100) / 100);
      setGesamt(Math.round((((total*4)/3) + Number.EPSILON) * 100) / 100);
    }
  },[fassade, fenster, dach, keller, lüftung])

  const destructuring = (value, index) => {
    let val = 0;
    if(value.length === 3 && index === 3){
      val = value[index - 1].modernization_impact_pct;
    }
    else if(value.length === 2 && index === 2){
      val = value[index - 1].modernization_impact_pct;
    }
    else if(value.length === 2 && index === 3){
      val = value[index - 2].modernization_impact_pct;
    }
    else if(value.length === 1 && index === 1){
      val = value[index - 1].modernization_impact_pct;
    }
    else if(value.length === 1 && index === 2){
      val = value[index - 2].modernization_impact_pct;
    }
    else if(value.length === 1 && index === 3){
      val = value[index - 3].modernization_impact_pct;
    }
    else{
      val = value[index].modernization_impact_pct;
    }

    return val;
  }

  const destructuringDesc = (value, index) => {
    let val = '';
    if(value.length === 3 && index === 3){
      val = value[index - 1]?.description;
    }
    else if(value.length === 2 && index === 2){
      val = value[index - 1]?.description;
    }
    else if(value.length === 2 && index === 3){
      val = value[index - 2]?.description;
    }
    else if(value.length === 1 && index === 1){
      val = value[index - 1]?.description;
    }
    else if(value.length === 1 && index === 2){
      val = value[index - 2]?.description;
    }
    else if(value.length === 1 && index === 3){
      val = value[index - 3]?.description;
    }
    else{
      val = value[index]?.description;
    }
    return val;
  }

  const preventMinus = (e) => {
    if (e.code === 'Minus') {
        e.preventDefault();
    }
  };
  const successAlert = () => {
    if(jahr !== '' && jahr >=1800 && gType !== '' && wGesamt !== ''){
      Swal.fire({
        title: 'Erfolg!',
        text: 'Daten wurden erfolgreich abgerufen!!',
        icon: 'success',
        confirmButtonText: 'OK'
      })
    }
    else if(jahr <= 1799 ){
      Swal.fire({
        title: 'bist du sicher?',
        text: 'Da das Jahr vor 1800 liegt, wird die Energieklasse auf 1 gesetzt.!!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ja, weiter!'
      }).then((result) => {
        if (result.isConfirmed) {
          ; // Do nothing!
        }
        else{
          clearInputs();
        }
      })
      
    }
    
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: purple[500],
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#66bb6a',
      },
    },
  });

  const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

  const IOSSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
    height: 2,
    padding: '15px 0',
    '& .MuiSlider-thumb': {
      height: 28,
      width: 28,
      backgroundColor: '#fff',
      boxShadow: iOSBoxShadow,
      '&:focus, &:hover, &.Mui-active': {
        boxShadow:
          '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          boxShadow: iOSBoxShadow,
        },
      },
    },
    '& .MuiSlider-valueLabel': {
      fontSize: 12,
      fontWeight: 'normal',
      top: -6,
      backgroundColor: 'unset',
      color: theme.palette.text.primary,
      '&:before': {
        display: 'none',
      },
      '& *': {
        background: 'transparent',
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      },
    },
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-rail': {
      opacity: 0.5,
      backgroundColor: '#bfbfbf',
    },
    '& .MuiSlider-mark': {
      backgroundColor: '#bfbfbf',
      height: 8,
      width: 1,
      '&.MuiSlider-markActive': {
        opacity: 1,
        backgroundColor: 'currentColor',
      },
    },
  }));

  const PrettoSlider = styled(Slider)({
    color: '#52af77',
    height: 8,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: '#52af77',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&:before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(45deg)',
      },
    },
  });

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
  ];

  const clearInputs = e => {
    e = e || window.event;
    e.preventDefault();
    document.getElementById('gebäude hinzufüngen').reset();
    setJahr('');
    setGType('');
    setWgesamt('');
    setFassadeDesc('');
    setDachDesc('');
    setFensterDesc('');
    setKellerDesc('');
    setLüftungDesc('');
    setDach(0);
    setFassade(0);
    setFenster(0);
    setKeller(0);
    setLüftung(0);
    setGesamt(0);
    setEnergy(0);
    setData(null);
    
  }

  useEffect(() => {
    if(jahr <= 1799){
      getInfo(1800, gType);
    }
    else{
      getInfo(jahr, gType);
    }
  },[jahr, gType])
  
  async function getInfo(construction_year, building_type){
    const token = process.env.REACT_APP_API_KEY;
    const url = process.env.REACT_APP_URL;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    }

    try {
      setLoading(true);
      const response = await axios.post(url, {
        'construction_year': construction_year,
        'building_type': building_type
      }, {
        headers: headers
      })
      const d = await response.data;
      setData(d);
      setLoading(false);      
    } catch (error) {
      setError("Error fetching data");
    }
      
  }

  const linearInterpolation = (x, minX, maxX, yList) => {
    if (yList.length === 0) { 
      return 0; 
    } 
    else if (yList.length === 1) 
    { 
      return yList[0]; 
    }
    const xPartitionSize = (maxX - minX) / (yList.length - 1); 
    const xPartition = (x - minX) / xPartitionSize; 
    const xPartitionBelow = Math.floor(xPartition); 
    const yBelow = yList[xPartitionBelow]; 
    const yAbove = yList[Math.min(xPartitionBelow + 1, yList.length - 1)];
    const yAboveProp = xPartition - xPartitionBelow; 
    const yBelowProp = 1 - yAboveProp; 
    
    return yAboveProp * yAbove + yBelowProp * yBelow; 
  }

  const formSubmit = (e) => {
    e.preventDefault();
    setDach(0);
    setFassade(0);
    setFenster(0);
    setKeller(0);
    setLüftung(0);
    setGesamt(0);
    setEnergy(0);
    setFassadeDesc('');
    setDachDesc('');
    setFensterDesc('');
    setKellerDesc('');
    setLüftungDesc('');
    let construction_year = document.getElementById('Baujahr').value;
    const building_type = document.getElementById('underline_select').value;
    if(construction_year <= 1799){
      construction_year = 1800;
    }
    console.log(construction_year, building_type);
   
    getInfo(construction_year,building_type);
    console.log(data);
    if(data!==null){
      const {references, status, statistical_consumption_data} = data;
      const {gross_energy_roomheating_values, gross_energy_waterheating_values} = statistical_consumption_data;
      const {cellarroof, hull, roof, windows, ventilation} = references;
      setFassadeDesc(hull[fassade]?.description);
      setDachDesc(roof[dach]?.description);
      setFensterDesc(windows[fenster]?.description);
      setKellerDesc(cellarroof[keller]?.description);
      setLüftungDesc(ventilation[lüftung]?.description);
      const roomheating = linearInterpolation(0, 0, 75, gross_energy_roomheating_values);
      console.log("Roomheating: "+roomheating);
      const waterheating = linearInterpolation(0, 0, 75, gross_energy_waterheating_values);
      console.log("Waterheating: "+waterheating);
      const Endenergieverbrauche = roomheating + waterheating;
      console.log("Endenergieverbrauche: "+Endenergieverbrauche);
      setEnergy(Math.round((Endenergieverbrauche + Number.EPSILON) * 100) / 100);
      
    }
    
  }

  const captureImage = (e) => {
    e.preventDefault();
    html2canvas(document.body).then(function(canvas){
      var a = document.createElement('a');
      a.href = canvas.toDataURL("image/jpeg");
      a.download = 'EnergyARK.png';
      a.click();
    })
  }

  
  return (
    <div className='flex flex-col py-1 px-4 shadow-xl min-h-screen min-w-full space-y-5'>
      {/*<div className='w-full h-30 px-1 py-2 rounded-lg justify-items-center'>
          <div className='flex space-x-1 w-fit px-3 py-3 rounded-full items-center text-white bg-slate-500 cursor-pointer hover:bg-green-200 hover:text-gray-600 duration-300'>
            <PlusIcon className='h-5 w-5'/>
            <p>GEBÄUDEZUSTAND HINZUFÜNGEN</p>
          </div>
  </div>*/}
      <div className='w-full h-50 px-3 py-4 rounded-xl shadow-xl bg-slate-100 '>
        <div>
            <h1 className=' pb-10 text-2xl'>GEBÄUDEZUSTAND</h1>
        </div>
          <form id='gebäude hinzufüngen' onSubmit={formSubmit}>
              <div className='space-y-2'>
                <div className='flex space-x-10 '>
                  <div className='relative'>
                    <input type='number' min={0} onChange={(e)=>setWgesamt(e.target.value)} onKeyPress={preventMinus} id='Wohnfläche gesamt' placeholder="Wohnfläche gesamt (in m²)" className='h-10 px-2 bg-slate-100 placeholder-transparent focus:outline-none border-b-2 focus:border-green-600 transition-colors peer' required></input>
                    <label for='Wohnfläche gesamt' id='Wohnfläche gesamt-label' className='absolute cursor-text left-0 -top-4 text-xs text-green-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:text-xs peer-focus:text-green-600 peer-focus:-top-4 duration-200'>Wohnfläche gesamt (in m²)</label>
                  </div>
                  <div className='relative'>
                    <input type='number' min={0} onChange={(e)=>setJahr(e.target.value)} onKeyPress={preventMinus} id='Baujahr' placeholder='Wohnungen gesamt' className='h-10 px-2 bg-slate-100 placeholder-transparent focus:outline-none border-b-2 focus:border-green-600 transition-colors peer' required></input>
                    <label for='Baujahr' className='absolute cursor-text left-0 -top-4 text-xs text-green-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:text-xs peer-focus:text-green-600 peer-focus:-top-4 duration-200'>Baujahr</label>
                  </div>
                  <div className="relative w-72">
                    <label for="underline_select" className="sr-only">Underline select</label>
                    <select defaultValue="type" onChange={(e)=>setGType(e.target.value)} id="underline_select" className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer" required> 
                        <option value="type">Wählen Sie einen Gebäudetyp</option>
                        <option value="EFH">Einfamilienhaus</option>
                        <option value="KLMFH">Kleines Mehrfamilienhaus</option>
                        <option value="GRMFH">Großes Mehrfamilienhaus</option>
                        <option value="RHDH">Reihen- und Doppelhaus</option>
                    </select>
                  </div>
                </div>
                <div className='flex space-x-5 items-center justify-end'>
                    <div>
                        <button onClick={()=>clearInputs()} className='border-b px-5 py-3 rounded-full bg-slate-500 text-white hover:bg-green-200 hover:text-gray-600 duration-300'>ABBRECHEN</button>
                    </div>
                    <div>
                        <button onClick={successAlert} className='border-b px-5 py-3 rounded-full bg-slate-500 text-white hover:bg-green-200 hover:text-gray-600 duration-300' >WEITER</button>
                    </div>
                    {/*<div>
                        <button onClick={captureImage} className='border-b px-5 py-3 rounded-full bg-green-400 text-gray-600 inline-flex items-center space-x-2 hover:text-gray-500 hover:bg-green-300 duration-300'>
                          <InboxArrowDownIcon className='h-5 w-5'/>
                          <p>LOAD DATA</p>
                        </button>
                      </div>*/}
                  </div>
              </div>
          </form>
      </div>
      <div className='w-full h-full py-1 items-center rounded-2xl shadow-xl shd bg-slate-100'>
        <div>
            <h1 className='px-3 pb-3 text-2xl'>MODERNISIERUNGZUSTAND</h1>
        </div>
        <div className='flex px-3 w-full space-x-16 py-1'>
            <div className='pr-2.5'>
              <h2 className='text-lg font-semibold'>Fassade</h2>
            </div>
            <div className='w-1/4 '>
              <ThemeProvider theme={theme}>
                <Slider aria-label='Restricted fassade' color='secondary' valueLabelDisplay='auto' value={fassade} step={1} min={0} max={3} marks={marks} onChange={e=>setFassade(e.target.value)} />
              </ThemeProvider>
              {console.log("Fassade: "+fassade)}
            </div> 
            <div className='pl-10'>
              <p className='text-lg font-semibold'>{fassadeDesc}</p>
            </div>
        </div>
        <div className='flex px-3 w-full space-x-16 py-1'>
            <div className='pr-3.5'>
              <h2 className=' text-lg font-semibold'>Fenster</h2>
            </div>
            <div className='w-1/4'>
              <ThemeProvider theme={theme}>
                <Slider aria-label='Restricted fenster' color='secondary' valueLabelDisplay='auto' value={fenster} step={1} min={0} max={3} marks={marks} onChange={e=>setFenster(e.target.value)} />
              </ThemeProvider>
              {console.log("Fenster: "+fenster)}
            </div>
            <div className='pl-10'>
              <p className='text-lg font-semibold'>{fensterDesc}</p>
            </div>
        </div>
        <div className='flex px-3 w-full space-x-24 py-1'>
            <div>
              <h2 className=' text-lg font-semibold'>Dach</h2>
            </div>
            <div className='w-1/4'>
              <ThemeProvider theme={theme}>
                <Slider aria-label='Restricted dach' color='secondary' valueLabelDisplay='auto' value={dach} step={1} min={0} max={3} marks={marks} onChange={e=>setDach(e.target.value)}   />
              </ThemeProvider>
              {console.log("DAch: "+dach)}
            </div>
            <div className='pl-2'>
              <p className='text-lg font-semibold'>{dachDesc}</p>
            </div>
        </div>
        <div className='flex px-3 w-full space-x-6 py-1'>
            <div>
              <h2 className=' text-lg font-semibold'>Keller(-decke)</h2>
            </div>
            <div className='w-1/4'>
              <ThemeProvider theme={theme}>
                <Slider aria-label='Restricted keller' color='secondary' valueLabelDisplay='auto' value={keller} step={1} min={0} max={3} marks={marks} onChange={e=>setKeller(e.target.value)}  />
              </ThemeProvider>
              {console.log("Kller: "+keller)}
            </div>
            <div className='pl-20'>
              <p className='text-lg font-semibold'>{kellerDesc}</p>
            </div>
        </div>
        <div className='flex px-3 w-full space-x-16 py-1'>
            <div className='pr-2'>
              <h2 className=' text-lg font-semibold'>Lüftung</h2>
            </div>
            <div className='w-1/4'>
              <ThemeProvider theme={theme}>
                <Slider aria-label='Restricted lüftung' color='secondary' valueLabelDisplay='auto' value={lüftung} step={1} min={0} max={1} marks={marks} onChange={e=>setLüftung(e.target.value)}  />
              </ThemeProvider>
              {console.log("luftung: "+lüftung)}
            </div>
            <div className='pl-10'>
              <p className='text-lg font-semibold'>{lüftungDesc}</p>
            </div>
        </div>
        <div className='flex  w-max items-center space-x-10'>
          <div className='flex px-3 w-full space-x-10 py-5'>
              <div>
                <h2 className='pr-2.5 text-lg font-semibold'>Modernisierungsgrad in %</h2>
              </div>
              <div className='w-full'>
                <ReactSpeedometer
                  maxValue={100}
                  value={gesamt}
                  height={500}
                  width={500}
                  needleColor="grey"
                  segmentColors={['#ff0000','#ff3300', '#ff6600', '#ff9900', '#ffcc00','#ffff00', '#d4ed13','#baed13', '#84ed13','#37ed13', '#16c910' ]}
                  segments={10}
                  textColor='black'
                />
              </div>
          </div>
          <div className='flex w-full space-x-40 py-1'>
              <div className='w-10'>
                <h2 className='pr-2.5 text-lg font-semibold'>Energieeffizienzklasse</h2>
              </div>
              <div className='w-full'>
                <ReactSpeedometer
                  maxValue={300}
                  value={energy}
                  height={500}
                  width={500}
                  needleColor="grey"
                  segmentColors={['#37ed13','#84ed13', '#baed13', '#d4ed13', '#ffff00', '#ffcc00', '#ff9900', '#ff6600', '#ff3300', '#ff0000', '#ff0000']}
                  textColor='black'
                  segments={9}
                  customSegmentStops={[0, 30, 50, 75, 100, 130, 160, 200, 250, 300]}
                  customSegmentLabels={[
                    {
                      text: 'A+',
                      position: 'INSIDE',
                    },
                    {
                      text: 'A',
                      position: 'INSIDE',
                    },
                    {
                      text: 'B',
                      position: 'INSIDE',
                    },
                    {
                      text: 'C',
                      position: 'INSIDE',
                    },
                    {
                      text: 'D',
                      position: 'INSIDE',
                    },
                    {
                      text: 'E',
                      position: 'INSIDE',
                    },
                    {
                      text: 'F',
                      position: 'INSIDE',
                    },
                    {
                      text: 'G',
                      position: 'INSIDE',
                    },
                    {
                      text: 'H',
                      position: 'INSIDE',
                    },

                  ]}
                  currentValueText={'Erwaterter Endenergieverbrauch = ${value} kWh/m²a'}
                  
                />
              </div>
              <div className='relative 
                              before:content-[attr(data-tip)]
                              before:absolute
                              before:px-3 beore:py-2
                              before:left-1/2 before:-top-3
                              before:w-max before:max-w-xs
                              before:-translate-x-1/2 before:-translate-y-full
                              before:bg-gray-700 before:text-white
                              before:rounded-md before:opacity-0
                              before:transition-all
                              
                              
                              after:absolute
                              after:left-1/2 after:-top-3
                              after:h-0 after:w-0
                              after:-translate-x-1/2 after:border-8
                              after:border-t-gray-700
                              after:border-l-transparent
                              after:border-b-transparent
                              after:border-r-transparent
                              after:opacity-0
                              after:transiton-all
                              
                              hover:before:opacity-100 hover:after:opacity-100'
                            
                              data-tip='Energy Rating:
                                        (0 - 30 : A+),
                                        (31 - 50 : A), 
                                        (51 - 75 : B), 
                                        (76 - 100 : C),
                                        (101 - 130 : D), 
                                        (131 - 160 : E),
                                        (161 - 200 : F),
                                        (201 - 250 : G),
                                        (251 - 300+ : H)'
                            >
                  <InformationCircleIcon className='h-10 w-10 cursor-pointer'/>
              </div>
              
          </div>
        </div>
      </div>
    </div>
  )
                
}

export default MainView