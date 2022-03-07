// Function imports
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// React components
import JobCard from '../JobCard/JobCard';

function JobPage() {

    // Dispatch hook, store access
    const dispatch = useDispatch();
    // const animals = useSelector(store => store.animals);

    useEffect(() => {
        dispatch({ type: 'FETCH_JOBS' });
      }, []);


    return(
        <>
        {Array.isArray(jobs) ?
            jobs.map( job => (
            <JobCard job={job} />
        )) : <p>Loading...</p>}
        </>
    )
}

export default AnimalsPage;