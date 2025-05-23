import { supabase } from './supabase.service';
import { Asistencia } from '../models/supabase.model';
import { AuthService } from './auth.service';

// Servicios para Asistencias
export const asistenciaService = {
    async getAll(): Promise<Asistencia[]> {
      const { data, error } = await supabase.from('asistencias').select('*');
      if (error) throw error;
      return data;
    },
  
    async create(asistencia: Omit<Asistencia, 'id' | 'created_at'>): Promise<Asistencia> {
      const { data, error } = await supabase.from('asistencias').insert(asistencia).select().single();
      if (error) throw error;
      return data;
    },
  
    async update(id: number, asistencia: Partial<Asistencia>): Promise<Asistencia> {
      const { data, error } = await supabase.from('asistencias').update(asistencia).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
  
    async delete(id: number): Promise<void> {
      const { error } = await supabase.from('asistencias').delete().eq('id', id);
      if (error) throw error;
    },

    async registrarAsistencia(entrenador_id: string, equipo_id: string, fecha: string): Promise<void> {
      const { data, error } = await supabase.from('asistencia_global').select('*').eq('equipo_id', equipo_id).eq('fecha', fecha);

      if (data && data.length > 0) {
            throw new Error('Ya existe una asistencia con esta fecha para el equipo.');
      } else {
        const { error: rpcError } = await supabase.rpc('crear_asistencia',{
        ent_id: entrenador_id,
        equ_id: equipo_id,
        fecha_a: fecha
      });

      if (rpcError) throw rpcError;
      }
    },

    async listarAsistencias(limite: number = 20): Promise<Asistencia[]> {
      const { data, error } = await supabase
        .from('asistencia_listar')
        .select('*')
        .limit(limite);
      if (error) throw error;
      return data;
    },

    async listarAsistDeportistas(asistencia_id: string): Promise<Asistencia[]> {
      const { data, error } = await supabase.from('asis_deportistas').select('*').eq('aglobal_id', asistencia_id);
      if (error) throw error;
      return data;
    },

    async updAsistenciaDep(id: number, estado: string, observacion: string): Promise<void> {
      const { error } = await supabase.from('asistencias').update({ estado: estado, observacion: observacion }).eq('id', id).select().single();
      if (error) throw error;
    },

    async getAsistenciasDeportista(): Promise<Asistencia[]> {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase.from('asis_deportistas').select('*').eq('deportista_id', user.id).order('fecha', { ascending: false });

      if (error) throw error;

      return data
    }
  };