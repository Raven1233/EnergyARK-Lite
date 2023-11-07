import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const useAxios = (construction_year, building_type) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const url = process.env.REACT_APP_URL;
    const token = process.env.REACT_APP_API_KEY;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    }

    useEffect(() => {
        const fetchData = async () => {
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
          };
          fetchData();
    }, [url, headers, construction_year, building_type]);

    return { data, error, loading };
}

export default useAxios;