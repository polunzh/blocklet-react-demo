import { Suspense } from 'react';
import { Grid } from '@mui/material';
import ProfileDisplay from '../components/profile-display';
import Navbar from '../components/navbar';
import './home.css';
import RequestProfileConnect from '@/components/wallet-connect';

function Home() {
  return (
    <main className="page-container">
      <Navbar />
      {/* <RequestProfileConnect /> */}
      <Grid container spacing={2} className="mb-4">
        <Grid item xs={12} sm={6}>
          {/* <h1 className="text-3xl font-bold">User Profile</h1> */}
        </Grid>
      </Grid>
      <Grid container spacing={2} className="">
        <Grid item xs={12} md={6}>
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileDisplay />
          </Suspense>
        </Grid>
      </Grid>
    </main>
  );
}

export default Home;
