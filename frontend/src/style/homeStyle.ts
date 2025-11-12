import { StyleSheet } from "react-native";

const AZUL_MARINHO = "#0A2740";
const DOURADO = "#D4AF37";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  // Cabeçalho
  headerArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "700",
    color: AZUL_MARINHO,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
    color: "#555",
  },
  profileIcon: {
    width: 50,
    height: 50,
  },

  // Card do Paciente
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DOURADO,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: AZUL_MARINHO,
    marginBottom: 8,
  },
  profileText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  editButton: {
    backgroundColor: AZUL_MARINHO,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  editButtonText: {
    color: DOURADO,
    fontWeight: "700",
    fontSize: 14,
  },

  // Sessões (Tarefas / Medicamentos)
  section: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AZUL_MARINHO,
  },
  link: {
    color: AZUL_MARINHO,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "700",
    color: AZUL_MARINHO,
    marginBottom: 2,
  },
  cardText: {
    fontSize: 15,
    color: "#333",
  },
});

export default styles; // ✅ export default para funcionar com `import styles`
