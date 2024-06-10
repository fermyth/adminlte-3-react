interface Timesheet {
    jam_masuk: string;
    jam_keluar: string;
    km_in: string;
    km_out: string;
    lk_pp: string | null;
    lk_inap: string;
    lain_lain: string;
    nopol: string | null;
    name_users: string;
    km_in_images: string | null;
    km_out_images: string | null;
    lat_km_in: string | null;
    long_km_in: string | null;
    lat_km_out: string | null;
    long_km_out: string | null;
    lat_lk_pp: string | null;
    long_lk_pp: string | null;
    lat_lk_inap: string | null;
    long_lk_inap: string | null;
  }
  
  export interface DriverData {
    nama: string | null;
    name_users: string;
    user_id: number | null;
    timesheet: { [key: string]: Timesheet };
  }
  
  export interface ApiResponse {
    success: boolean;
    data: DriverData[];
  }
  