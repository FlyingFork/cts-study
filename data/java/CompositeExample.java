// ============================================================
// COMPOSITE PATTERN — "Treat a single item and a group the same way"
// ============================================================
// PROBLEM: You have a tree structure where folders contain files OR
// other folders. You want to call getSize() on anything — file or folder —
// without knowing which one you have.
// SOLUTION: Both File and Folder implement the same interface.
// Folder stores children (also FileSystemItem) and delegates to them.

import java.util.ArrayList;
import java.util.List;

// ── COMPONENT (the shared interface for BOTH leaf and composite) ──
interface FileSystemItem {
    String getName();
    long getSize();                 // both File and Folder must implement this
    void print(String indent);      // recursive display
}

// ── LEAF (no children — throws UnsupportedOperationException for add/remove) ──
class File implements FileSystemItem {
    private String name;
    private long size;

    public File(String name, long sizeInKB) {
        this.name = name;
        this.size = sizeInKB;
    }

    @Override
    public String getName() { return name; }

    @Override
    public long getSize() { return size; }

    @Override
    public void print(String indent) {
        System.out.println(indent + "📄 " + name + " (" + size + " KB)");
    }
}

// ── COMPOSITE (has children, each child is also a FileSystemItem) ──
class Folder implements FileSystemItem {
    private String name;
    private List<FileSystemItem> children = new ArrayList<>();

    public Folder(String name) {
        this.name = name;
    }

    public void add(FileSystemItem item) {
        children.add(item);
    }

    public void remove(FileSystemItem item) {
        children.remove(item);
    }

    @Override
    public String getName() { return name; }

    @Override
    public long getSize() {
        // COMPOSITE key: delegate to children, sum up
        long total = 0;
        for (FileSystemItem child : children) {
            total += child.getSize();  // works for both File and Folder!
        }
        return total;
    }

    @Override
    public void print(String indent) {
        System.out.println(indent + "📁 " + name + " (" + getSize() + " KB total)");
        for (FileSystemItem child : children) {
            child.print(indent + "   ");  // recurse
        }
    }
}

// ── TEST ──────────────────────────────────────────────────────
public class CompositeExample {
    public static void main(String[] args) {
        // Build a tree: root -> documents -> report.pdf
        //                              -> notes.txt
        //             root -> pictures -> photo.jpg
        //             root -> readme.txt

        File report = new File("report.pdf", 500);
        File notes  = new File("notes.txt", 20);
        File photo  = new File("photo.jpg", 2000);
        File readme = new File("readme.txt", 5);

        Folder documents = new Folder("Documents");
        documents.add(report);
        documents.add(notes);

        Folder pictures = new Folder("Pictures");
        pictures.add(photo);

        Folder root = new Folder("Root");
        root.add(documents);
        root.add(pictures);
        root.add(readme);

        // Same call works on File, Folder, or any level of nesting
        root.print("");

        System.out.println("\nTotal size of 'Documents': " + documents.getSize() + " KB");
        System.out.println("Total size of 'Root':      " + root.getSize() + " KB");
    }
}
