import { useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// 1. Definimos la estructura de una tarea.
type Task = {
  id: string;
  title: string;
  completed: boolean;
};

// 2. Definimos los filtros disponibles.
type Filter = "Todas" | "Pendientes" | "Completadas";

export default function HomeScreen() {
  // 3. Estado para almacenar el texto del campo.
  const [taskText, setTaskText] = useState("");

  // 4. Estado que contiene todas las tareas.
  const [tasks, setTasks] = useState<Task[]>([]);

  // 5. Estado para saber qué filtro está seleccionado.
  const [filter, setFilter] = useState<Filter>("Todas");

  // 6. Agregar una tarea nueva.
  const addTask = () => {
    const title = taskText.trim();

    // Evitamos agregar tareas vacías.
    if (title.length === 0) {
      return;
    }

    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      title: title,
      completed: false,
    };

    // Creamos un nuevo arreglo con la tarea agregada.
    setTasks((currentTasks) => [...currentTasks, newTask]);

    // Limpiamos el campo de texto.
    setTaskText("");
    Keyboard.dismiss();
  };

  // 7. Cambiar el estado de una tarea.
  const toggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // 8. Eliminar una tarea por su identificador.
  const deleteTask = (id: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  // 9. Filtrar las tareas que se van a mostrar.
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pendientes") {
      return !task.completed;
    }

    if (filter === "Completadas") {
      return task.completed;
    }

    return true;
  });

  // 10. Calcular cuántas tareas faltan por completar.
  const pendingCount = tasks.filter((task) => !task.completed).length;

  // 11. Dibujar la interfaz.
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>MI TODO LIST</Text>
        <Text style={styles.title}>Mis tareas</Text>
        <Text style={styles.subtitle}>
          {pendingCount === 0
            ? "¡Todo listo! Puedes agregar una tarea."
            : `Tienes ${pendingCount} ${
                pendingCount === 1 ? "tarea pendiente" : "tareas pendientes"
              }`}
        </Text>
      </View>

      {/* Campo para escribir y agregar una tarea */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="¿Qué necesitas hacer?"
          placeholderTextColor="#94A3B8"
          value={taskText}
          onChangeText={setTaskText}
          onSubmitEditing={addTask}
          returnKeyType="done"
          maxLength={120}
        />

        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
          onPress={addTask}
          accessibilityRole="button"
          accessibilityLabel="Agregar tarea"
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Botones para filtrar la lista */}
      <View style={styles.filters}>
        {(["Todas", "Pendientes", "Completadas"] as Filter[]).map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterButton,
              filter === item && styles.activeFilter,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.activeFilterText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Lista de tareas */}
      <FlatList
        style={styles.list}
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          filteredTasks.length === 0 ? styles.emptyList : styles.listContent
        }
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Pressable
              style={styles.taskMain}
              onPress={() => toggleTask(item.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.completed }}
              accessibilityLabel={item.title}
            >
              <View
                style={[styles.checkbox, item.completed && styles.checkedBox]}
              >
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>

              <Text
                style={[
                  styles.taskTitle,
                  item.completed && styles.completedText,
                ]}
              >
                {item.title}
              </Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Eliminar ${item.title}`}
            >
              <Text style={styles.deleteText}>×</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>
              {filter === "Todas"
                ? "Aún no tienes tareas"
                : "No hay tareas en esta sección"}
            </Text>
            <Text style={styles.emptyText}>
              {filter === "Todas"
                ? "Escribe una tarea arriba para comenzar."
                : "Prueba con otro filtro o agrega una tarea."}
            </Text>
          </View>
        }
      />

      <Text style={styles.footer}>
        {tasks.length} {tasks.length === 1 ? "tarea creada" : "tareas creadas"}
      </Text>
    </View>
  );
}

// 12. Estilos de la aplicación.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: "#172554",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 15,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#172554",
  },
  addButton: {
    width: 52,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "400",
  },
  pressed: {
    opacity: 0.7,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 4,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#E8EDF5",
  },
  activeFilter: {
    backgroundColor: "#2563EB",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
  },
  emptyList: {
    flexGrow: 1,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E9EEF5",
  },
  taskMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  taskTitle: {
    flex: 1,
    color: "#1E293B",
    fontSize: 15,
  },
  completedText: {
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  deleteText: {
    color: "#EF4444",
    fontSize: 26,
    lineHeight: 28,
  },
  emptyContainer: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyTitle: {
    color: "#334155",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },
  footer: {
    textAlign: "center",
    paddingVertical: 14,
    color: "#94A3B8",
    fontSize: 12,
  },
});
