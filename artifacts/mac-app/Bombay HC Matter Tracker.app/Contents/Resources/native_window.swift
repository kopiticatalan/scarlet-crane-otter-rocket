import AppKit
import WebKit

/// The native macOS shell for the local matter tracker.  Keeping this as a
/// normal AppKit application (instead of an AppleScript event loop) ensures
/// window events, text fields, scrolling and WKWebView stay responsive.
final class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate {
    private var window: NSWindow!
    private var webView: WKWebView!

    func applicationDidFinishLaunching(_ notification: Notification) {
        let urlText = CommandLine.arguments.dropFirst().first ?? "http://127.0.0.1:8765/"
        let config = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: config)
        webView.autoresizingMask = [.width, .height]

        window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 1440, height: 920),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "Bombay HC Matter Tracker"
        window.minSize = NSSize(width: 1040, height: 680)
        window.contentView = webView
        window.delegate = self
        window.center()
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)

        guard let url = URL(string: urlText) else { return }
        webView.load(URLRequest(url: url))
    }

    // Closing the native window ends this window process.  The small local
    // service may remain available for a quick reopen / scheduled scan; the
    // dashboard's Settings page provides an explicit full quit.
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        true
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
