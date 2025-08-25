import React, { useState } from 'react'
import API from '@/service/apiService'
const useFetch = () => {
    const [data , setData] = useState([])
    const [loading , setLoading] = useState(null);
    const [error , setError] = useState(false);

    const fetchData = async (endpointName, body = null) => {
        setLoading(true)
        setError(null)
        try {
          const response = await API[endpointName](body)
          if (response?.isSuccess) {
            setData(response.data)
            return response.data
          }
        } catch (e) {
          setError(e.message)
        } finally {
          setLoading(false)
        }
      }
      

    return {loading ,error ,data , fetchData}
}

export default useFetch
