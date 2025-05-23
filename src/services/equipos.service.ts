import { supabase } from './supabase.service';
import { Equipo } from '../models/supabase.model';
import { AuthService } from './auth.service';

// Servicios para Equipos
export const equipoService = {
    async getAll(): Promise<Equipo[]> {
      const { data, error } = await supabase.from('equipos').select('*').eq('activo', true);
      if (error) throw error;
      return data;
    },
  
    async getById(id: string) {
      const { data, error } = await supabase
        .from('equipos')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Equipo;
    },
  
    async create(equipo: Omit<Equipo, 'id' | 'created_at'>): Promise<Equipo> {
      const { data, error } = await supabase.from('equipos').insert(equipo).select().single();
      if (error) throw error;
      return data;
    },
  
    async update(id: number, equipo: Partial<Equipo>): Promise<Equipo> {
      const { data, error } = await supabase.from('equipos').update(equipo).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
  
    async delete(id: number): Promise<void> {
      const { error } = await supabase
        .from('equipos')
        .update({ activo: false })
        .eq('id', id);
      if (error) throw error;
    },
  
    async getEquiposDeportista(): Promise<Equipo[]> {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');
  
      const { data, error } = await supabase.from('mis_equipos').select('*').eq('id', user.id);
      console.log('Datos de equipos:', data);
      if (error) throw error;
  
      return data;
    }
  };