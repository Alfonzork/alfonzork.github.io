import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonButtons,
  IonToast,
  IonSearchbar,
  IonTextarea,
  IonInput
} from '@ionic/react';
import { add, create, trash, time, location } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { eventoService } from '../../services/eventos.service';
import { Evento } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';
import AccessibleModal from '../../components/AccessibleModal';
import Calendario from '../../components/Calendario';
import AppHeader from '../../components/AppHeader';

const CalendarioEntrenador: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [eventoEditar, setEventoEditar] = useState<Evento | null>(null);
  const [searchText, setSearchText] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    tipo: 'entrenamiento' as 'entrenamiento' | 'presentacion' | 'evento',
    ubicacion: '',
  });

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const eventosData = await eventoService.getAll();
      setEventos(eventosData);
    } catch (error) {
      setToastMessage('Error al cargar los datos');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (eventoEditar) {
        await eventoService.update(eventoEditar.id, formData);
        setToastMessage('Evento actualizado correctamente');
      } else {
        await eventoService.create(formData);
        setToastMessage('Evento creado correctamente');
      }
      setShowModal(false);
      cargarDatos();
    } catch (error) {
      setToastMessage('Error al guardar el evento');
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await eventoService.delete(id);
      setToastMessage('Evento eliminado correctamente');
      cargarDatos();
    } catch (error) {
      setToastMessage('Error al eliminar el evento');
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  const abrirModalEditar = (evento: Evento) => {
    setEventoEditar(evento);
    setFormData({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha_inicio: evento.fecha_inicio,
      fecha_fin: evento.fecha_fin,
      tipo: evento.tipo,
      ubicacion: evento.ubicacion
    });
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setEventoEditar(null);
    setFormData({
      titulo: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      tipo: 'entrenamiento',
      ubicacion: ''
    });
    setShowModal(true);
  };

  const eventosFiltrados = eventos.filter(evento => {
    const searchLower = searchText.toLowerCase();
    const titulo = evento.titulo?.toLowerCase() || '';
    const descripcion = evento.descripcion?.toLowerCase() || '';
    const ubicacion = evento.ubicacion?.toLowerCase() || '';
    return titulo.includes(searchLower) || 
           descripcion.includes(searchLower) || 
           ubicacion.includes(searchLower);
  });

  const eventosPasados = eventosFiltrados.filter(evento => 
    new Date(evento.fecha_inicio) < new Date()
  );

  const eventosProximos = eventosFiltrados.filter(evento => 
    new Date(evento.fecha_inicio) >= new Date()
  );

  return (
    <IonPage>
      <AppHeader title="Calendario" />
      <Calendario />
    </IonPage>
  );
};

export default CalendarioEntrenador; 