<?php

defined('ABSPATH') || exit;

use Roots\WPConfig\Config;

/**
 * Maybe create the table for debug logs.
 */
add_action('wp_loaded', function (): void {
    global $wpdb;

    // Check if the table exists.
    foreach ($wpdb->get_col('SHOW TABLES', 0) as $table) {
        if ($table === 'adt_debug_logs') {
            return;
        }
    }

    // Create the table.
    $charsetCollate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE `adt_debug_logs` (
       id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
       log_name VARCHAR(255) NOT NULL DEFAULT 'default',
       user_id INT(11) UNSIGNED,
       url TEXT,
       message TEXT NOT NULL,
       context LONGTEXT,
       created_at DATETIME NOT NULL,
       PRIMARY KEY (id)
    ) $charsetCollate;";

    $wpdb->query($sql);

    // Verify that we're successful in creating the table.
    foreach ($wpdb->get_col('SHOW TABLES', 0) as $table) {
        if ($table === 'adt_debug_logs') {
            return;
        }
    }

    throw new Exception('`adt_debug_logs` table could not be created.');
});

function adt_debug_log(string $message, ?array $context = null, string $logName = 'default'): int
{
    global $wpdb;

    $url = get_permalink() ?: null;

    if (isset($_SERVER['HTTP_HOST'], $_SERVER['REQUEST_URI'])) {
        $url = "{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
    }

    $wpdb->insert('adt_debug_logs', [
        'log_name' => $logName,
        'user_id' => get_current_user_id() ?: null,
        'url' => $url,
        'message' => $message,
        'context' => $context ? json_encode($context) : null,
        'created_at' => date('Y-m-d H:i:s'),
    ]);

    return $wpdb->insert_id;
}

function adt_is_admin(): bool
{
    $user = wp_get_current_user();

    // Logged in?
    if ($user->exists()) {
        // Admin or editor?
        if (! empty(array_intersect([
            'administrator',
            'editor',
        ], $user->roles))) {
            return true;
        }
    }

    return false;
}

function adt_is_uxbuilder(): bool
{
    return isset($_GET['uxb_iframe']);
}

if (! function_exists('ray')) {
    function ray()
    {
        return optional();
    }
}

if (! function_exists('adt_get_version')) {
    function adt_get_version()
    {
        $version = date('m');

        if (Config::get('ADT_VERSION', false)) {
            $version = (string) Config::get('ADT_VERSION');
        } elseif (defined('WP_DEBUG') && (bool) WP_DEBUG === true) {
            $version = time();
        }

        return $version;
    }
}

function adt_debug_hook(string $hook): array
{
    global $wp_filter;

    if (isset($wp_filter[$hook]->callbacks)) {
        array_walk($wp_filter[$hook]->callbacks, function ($callbacks, $priority) use (&$hooks) {
            foreach ($callbacks as $id => $callback) {
                $hooks[] = array_merge(['id' => $id, 'priority' => $priority], $callback);
            }
        });
    } else {
        return [];
    }

    foreach ($hooks as &$item) {
        // skip if callback does not exist
        if (! is_callable($item['function'])) {
            continue;
        }

        // function name as string or static class method eg. 'Foo::Bar'
        if (is_string($item['function'])) {
            $ref = strpos($item['function'], '::') ? new ReflectionClass(strstr($item['function'], '::', true)) : new ReflectionFunction($item['function']);
            $item['file'] = $ref->getFileName();
            $item['line'] = get_class($ref) == 'ReflectionFunction'
                ? $ref->getStartLine()
                : $ref->getMethod(substr($item['function'], strpos($item['function'], '::') + 2))->getStartLine();

        // array( object, method ), array( string object, method ), array( string object, string 'parent::method' )
        } elseif (is_array($item['function'])) {
            $ref = new ReflectionClass($item['function'][0]);

            // $item['function'][0] is a reference to existing object
            $item['function'] = [
                is_object($item['function'][0]) ? get_class($item['function'][0]) : $item['function'][0],
                $item['function'][1],
            ];
            $item['file'] = $ref->getFileName();
            $item['line'] = strpos($item['function'][1], '::')
                ? $ref->getParentClass()->getMethod(substr($item['function'][1], strpos($item['function'][1], '::') + 2))->getStartLine()
                : $ref->getMethod($item['function'][1])->getStartLine();

        // closures
        } elseif (is_callable($item['function'])) {
            $ref = new ReflectionFunction($item['function']);
            $item['function'] = get_class($item['function']);
            $item['file'] = $ref->getFileName();
            $item['line'] = $ref->getStartLine();
        }
    }

    return $hooks;
}

function adt_get_prefix($str) {
    $pos = strpos($str, "_"); // Find the underscore position
    if ($pos !== false) {
        return substr($str, 0, $pos); // Extract everything before the underscore
    }
    return $str; // Return the full string if no underscore is found
}